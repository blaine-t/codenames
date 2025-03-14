import Hero from "@/components/hero";

export default async function Home() {
  return (
    <div className="background">
      <div className="wrapper">
        <Hero />
        <h1 style={{textAlign: 'center'}}>Sign up or sign in now for some Codenames fun!</h1>
      </div>
    </div>
  );
}
