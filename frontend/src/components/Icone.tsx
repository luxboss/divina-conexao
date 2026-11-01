/** Ícones em SVG (sem emoji), com a cor do texto. */
export type NomeIcone = "coracao" | "estrela" | "casa" | "livro" | "grafico" | "grade" | "cruz" | "broto" | "calice" | "janela";

export default function Icone({ nome, cheio = false }: { nome: NomeIcone; cheio?: boolean }) {
  const preenchimento = cheio ? "currentColor" : "none";
  const comum = { className: "icone", viewBox: "0 0 24 24", "aria-hidden": true, focusable: false } as const;
  const traco = { stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

  if (nome === "estrela") {
    return (
      <svg {...comum}>
        <path d="M12 2l2.6 6.9L22 10l-5.5 4.6L18.2 22 12 18.2 5.8 22l1.7-7.4L2 10l7.4-1.1z" fill={preenchimento} {...traco} />
      </svg>
    );
  }
  if (nome === "casa") {
    return (
      <svg {...comum}>
        <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill={preenchimento} {...traco} />
      </svg>
    );
  }
  if (nome === "cruz") {
    return (
      <svg {...comum}>
        <path d="M12 2.5v19M6.5 8h11" fill="none" {...traco} strokeWidth={2} />
      </svg>
    );
  }
  if (nome === "broto") {
    return (
      <svg {...comum}>
        <path d="M12 21v-9" fill="none" {...traco} />
        <path d="M12 12c0-4.2-3-6.6-7.5-6.6 0 4.4 3 6.6 7.5 6.6zM12 12c0-3.4 2.4-5.8 6.5-5.8 0 3.6-2.4 5.8-6.5 5.8z" fill={preenchimento} {...traco} />
      </svg>
    );
  }
  if (nome === "calice") {
    return (
      <svg {...comum}>
        <path d="M6.5 3h11c0 5-2.4 8.5-5.5 8.5S6.5 8 6.5 3z" fill={preenchimento} {...traco} />
        <path d="M12 11.5V19M8.5 21h7" fill="none" {...traco} />
      </svg>
    );
  }
  if (nome === "janela") {
    return (
      <svg {...comum}>
        <path d="M5 21V9.5a7 7 0 0 1 14 0V21z" fill="none" {...traco} />
        <path d="M12 2.5V21M5 14h14" fill="none" {...traco} />
      </svg>
    );
  }
  if (nome === "livro") {
    return (
      <svg {...comum}>
        <path d="M2.5 5.5c3.2-1.2 6.4-1 9.5 1.3 3.1-2.3 6.3-2.5 9.5-1.3V19c-3.2-1.2-6.4-1-9.5 1.3-3.1-2.3-6.3-2.5-9.5-1.3z" fill={preenchimento} {...traco} />
        <path d="M12 6.8V20.3" fill="none" {...traco} />
      </svg>
    );
  }
  if (nome === "grade") {
    return (
      <svg {...comum}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill={preenchimento} {...traco} />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill={preenchimento} {...traco} />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill={preenchimento} {...traco} />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill={preenchimento} {...traco} />
      </svg>
    );
  }
  if (nome === "grafico") {
    return (
      <svg {...comum}>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" {...traco} />
      </svg>
    );
  }
  return (
    <svg {...comum}>
      <path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 2.9 5 6.5 5c2.1 0 3.5 1.2 4.1 2.2h.8C12 6.2 13.4 5 15.5 5c3.6 0 5.6 3.6 4.1 6.9C19.5 16.4 12 21 12 21z" fill={preenchimento} {...traco} />
    </svg>
  );
}
