import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import HomeClient from "@/components/home/home-client";
import { HeroData, Project, Skill, Category } from "@/lib/types";

// Revalidate data every 60 seconds
export const revalidate = 60;

async function getHeroData(): Promise<HeroData | null> {
  try {
    const snapshot = await get(ref(db, "hero/main_hero"));
    if (snapshot.exists()) {
      return snapshot.val() as HeroData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    const snapshot = await get(ref(db, "projects"));
    if (!snapshot.exists()) return [];

    const raw = snapshot.val();
    return Object.entries(raw)
      .map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function getSkills(): Promise<Skill[]> {
  try {
    const snapshot = await get(ref(db, "skills"));
    if (!snapshot.exists()) return [];

    const raw = snapshot.val();
    return Object.entries(raw)
      .map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)) as Skill[];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const snapshot = await get(ref(db, "categories"));
    if (!snapshot.exists()) return [];

    const raw = snapshot.val();
    return Object.entries(raw)
      .map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const heroData = await getHeroData();
  const projects = await getProjects();
  const skills = await getSkills();
  const categories = await getCategories();

  return (
    <HomeClient
      initialHero={heroData}
      initialProjects={projects}
      initialSkills={skills}
      initialCategories={categories}
    />
  );
}
