import Head from "next/head";
import { Background } from "@/components/Background";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";
import { Other } from "@/sections/Other";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Portfolio Template</title>
        <meta
          name="description"
          content="Simple portfolio template based on the original project."
        />
      </Head>

      <Background />
      <main className="relative z-10 pb-20">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Other />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
