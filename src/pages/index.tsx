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
        <title>Welcome | Rami Del Toro Personal Website</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Personal portfolio for Rami Del Toro, a software engineer building useful web, mobile, cloud, and AI-powered products."
        />
      </Head>

      <Background />
      <main className="relative z-10">
        <Navbar />
        <div className="portfolio-sections">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Other />
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
