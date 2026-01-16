// shadow dom status indicator
// this is for showing extraction running

export function showStatus(text) {
  let host = document.createElement("div");
  let shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>
      .box {
        position: fixed;
        bottom: 15px;
        right: 15px;
        background: #111;
        color: white;
        padding: 8px 10px;
        font-size: 12px;
        z-index: 999999;
        border-radius: 4px;
      }
    </style>
    <div class="box">${text}</div>
  `;

  document.body.appendChild(host);

  setTimeout(() => host.remove(), 3000);
}
