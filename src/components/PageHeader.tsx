interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="rise-in max-w-2xl">
      <span className="label-eyebrow">{eyebrow}</span>
      <h1 className="mt-4 text-4xl font-semibold leading-[1.03] sm:text-5xl">{title}</h1>
      {description && <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>}
    </header>
  );
}
