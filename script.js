const PROXY_URL = "https://rbx-shaders.talertsfxrc.workers.dev";

const form = document.getElementById("activate-form");
const codeInput = document.getElementById("code");
const nickInput = document.getElementById("nick");
const submitBtn = document.getElementById("submit-btn");
const status = document.getElementById("form-status");

// Текущий год в футере
document.getElementById("year").textContent = new Date().getFullYear();

function setStatus(message, type) {
  status.textContent = message;
  status.className = "form-status" + (type ? " " + type : "");
}

function validate() {
  let ok = true;
  [codeInput, nickInput].forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("invalid");
      ok = false;
    } else {
      input.classList.remove("invalid");
    }
  });
  return ok;
}

// Снимаем подсветку ошибки при вводе
[codeInput, nickInput].forEach((input) => {
  input.addEventListener("input", () => input.classList.remove("invalid"));
});

// Получаем IP пользователя (если не удалось — отправим "unknown")
async function getIp() {
  try {
    const res = await fetch("https://api.ipify.org/?format=json");
    const data = await res.json();
    return data.ip || "unknown";
  } catch {
    return "unknown";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("", "");

  if (!validate()) {
    setStatus("Заполни оба поля.", "err");
    return;
  }

  const code = codeInput.value.trim();
  const nick = nickInput.value.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправка...";

  try {
    const ip = await getIp();

    if (!PROXY_URL) throw new Error("PROXY_URL не настроен");

    const res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nick, code, ip }),
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    form.reset();
    setStatus("✅ Заявка отправлена! Доступ выдадим в ближайшее время.", "ok");
  } catch (err) {
    console.error(err);
    setStatus("❌ Не удалось отправить. Попробуй ещё раз позже.", "err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить";
  }
});
