import type { Metadata } from "next";
import { AspirasiForm } from "./aspirasi-form";

export const metadata: Metadata = {
  title: "Aspirasi — SIM ORMAWA",
  description: "Sampaikan aspirasi untuk KM Universitas Adzkia",
};

export default function AspirasiPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <AspirasiForm />
    </main>
  );
}