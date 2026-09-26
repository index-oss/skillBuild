import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <main>
      <header>
        <h1>SkillForge AI</h1>
        <UserButton />
      </header>

      <section>
        <h2>Dashboard</h2>
        <p>Your career workspace starts here.</p>
      </section>
    </main>
  );
}