import { PAYPAL_PAYMENT_URL } from "./config.js";
import {
  createRevision,
  isValidPayPalUrl,
  normalizeDraft,
  renderMarkdown,
  scheduleUrlRevocation,
  serializePassport,
} from "./passport.js";

const DRAFT_KEY = "threadkeeper.draft/v1";
const REVISIONS_KEY = "threadkeeper.revisions/v1";
const form = document.querySelector("#passport-form");
const resetDialog = document.querySelector("#reset-dialog");
const toast = document.querySelector("#toast");

const preview = {
  agentName: document.querySelector("#preview-agent"),
  ownerName: document.querySelector("#preview-owner"),
  purpose: document.querySelector("#preview-purpose"),
  identity: document.querySelector("#preview-identity"),
  communication: document.querySelector("#preview-communication"),
  relationship: document.querySelector("#preview-relationship"),
  boundaries: document.querySelector("#preview-boundaries"),
  uncertainties: document.querySelector("#preview-uncertainties"),
};

let revisions = readLocal(REVISIONS_KEY, []);
let toastTimer;

function readLocal(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function currentDraft() {
  return normalizeDraft(Object.fromEntries(new FormData(form)));
}

function setForm(draft) {
  Object.entries(normalizeDraft(draft)).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field) field.value = value;
  });
}

function renderDraft(draft) {
  const values = normalizeDraft(draft);
  preview.agentName.textContent = values.agentName || "Unnamed agent";
  preview.ownerName.textContent = values.ownerName || "Not specified";
  preview.purpose.textContent = values.purpose || "Not specified";
  ["identity", "communication", "relationship", "boundaries", "uncertainties"].forEach((field) => {
    preview[field].textContent = values[field] || "Not specified.";
  });
}

function saveDraft() {
  const draft = currentDraft();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  renderDraft(draft);
  document.querySelector("#save-state").textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function renderRevisions() {
  const list = document.querySelector("#revision-list");
  const count = revisions.length;
  document.querySelector("#revision-count").textContent = `${count} snapshot${count === 1 ? "" : "s"}`;
  document.querySelector("#revision-summary").textContent = count ? `Revision ${String(count).padStart(2, "0")} · locally saved` : "No revisions yet";

  if (!count) {
    list.innerHTML = '<li class="empty-revisions">Saved snapshots appear here. Later edits never rewrite them.</li>';
    return;
  }

  list.replaceChildren(...[...revisions].reverse().map((revision) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const meta = document.createElement("span");
    title.textContent = revision.label;
    meta.textContent = `${revision.id} · ${new Date(revision.createdAt).toLocaleString()}`;
    item.append(title, meta);
    return item;
  }));
}

function saveRevision() {
  const labelInput = document.querySelector("#revision-label");
  const revision = createRevision(currentDraft(), labelInput.value);
  revisions = [...revisions, revision];
  localStorage.setItem(REVISIONS_KEY, JSON.stringify(revisions));
  labelInput.value = "";
  renderRevisions();
  showToast("Immutable revision saved in this browser.");
}

function download(filename, body, type) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  scheduleUrlRevocation(url);
}

function safeFilename() {
  const name = currentDraft().agentName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return name || "continuity-passport";
}

function configureCheckout() {
  const ready = isValidPayPalUrl(PAYPAL_PAYMENT_URL);
  const status = document.querySelector("#checkout-status");
  document.querySelectorAll(".checkout-trigger").forEach((button) => {
    button.disabled = !ready;
    button.title = ready ? "Open secure PayPal checkout" : "Owner PayPal Payment Link required";
    if (ready) {
      button.addEventListener("click", () => {
        window.open(PAYPAL_PAYMENT_URL, "_blank", "noopener,noreferrer");
      });
    }
  });

  if (ready) {
    status.textContent = "Secure checkout opens on PayPal. Threadkeeper never receives card details.";
    status.classList.add("is-ready");
  }
}

form.addEventListener("input", saveDraft);
document.querySelector("#save-revision").addEventListener("click", saveRevision);
document.querySelector("#new-draft").addEventListener("click", () => resetDialog.showModal());
document.querySelector("#confirm-reset").addEventListener("click", () => {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(REVISIONS_KEY);
  revisions = [];
  form.reset();
  renderDraft({});
  renderRevisions();
  showToast("Local draft and revisions cleared.");
});
document.querySelector("#download-markdown").addEventListener("click", () => {
  download(`${safeFilename()}.md`, renderMarkdown(currentDraft(), revisions), "text/markdown;charset=utf-8");
  showToast("Markdown passport downloaded.");
});
document.querySelector("#download-json").addEventListener("click", () => {
  download(`${safeFilename()}.json`, serializePassport(currentDraft(), revisions), "application/json;charset=utf-8");
  showToast("JSON passport downloaded.");
});

const storedDraft = readLocal(DRAFT_KEY, {});
setForm(storedDraft);
renderDraft(storedDraft);
renderRevisions();
configureCheckout();
