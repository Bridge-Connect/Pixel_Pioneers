"use client"

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { db, auth } from "@/lib/firebase-client";
import { doc, getDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input-component";
import { Button } from "@/components/ui/button-component";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card-component";
import HeaderNavigation from "@/components/layout/HeaderNavigation";
import AuthGuardComponent from "@/components/auth/AuthGuardComponent";

export default function DictionaryPage() {
  const [word, setWord] = useState("");
  const [video, setVideo] = useState<{ drive_id: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVideo(null);
    setLoading(true);
    const trimmedWord = word.trim().toLowerCase();
    if (!trimmedWord) {
      setError("Please enter a word.");
      setLoading(false);
      return;
    }
    const firstLetter = trimmedWord[0];
    try {
      const docRef = doc(db, "Dictonary", firstLetter);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (trimmedWord in data) {
          setVideo(data[trimmedWord]);
        } else {
          setError(`No video found for '${trimmedWord}'.`);
        }
      } else {
        setError(`No video found for '${trimmedWord}'.`);
      }
    } catch (err) {
      setError("Error fetching data from Firestore.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuardComponent>
      <HeaderNavigation user={user} />
      <div className="min-h-screen bg-gradient-to-br  from-blue-100 via-teal-100 to-white flex flex-col items-center justify-start py-10 px-2">
        <Card className="max-w-4xl w-full shadow-2xl bg-white/90 backdrop-blur-md border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
              <span role="img" aria-label="Dictionary">📚</span> Dictionary Video Search <span role="img" aria-label="Sign">🤟</span>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-lg">
              <span role="img" aria-label="Hint">🔎</span> Enter a word to find its sign language video! <span role="img" aria-label="Sparkles">✨</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6 animate-fade-in">
              <Input
                type="text"
                placeholder="Type a word... ✍️"
                value={word}
                onChange={e => setWord(e.target.value)}
                disabled={loading}
                required
                className="text-lg"
              />
              <Button
                type="submit"
                disabled={loading}
                className="transition-transform duration-200 hover:scale-105 text-lg flex items-center gap-1"
              >
                {loading ? (
                  <span className="animate-spin">🔄</span>
                ) : (
                  <>
                    <span role="img" aria-label="Search">🔍</span> Search
                  </>
                )}
              </Button>
            </form>
            {error && (
              <div className="text-red-500 mb-4 flex items-center gap-2 text-lg animate-shake">
                <span role="img" aria-label="Oops">😕</span> {error}
                {error.startsWith("No video") && <span role="img" aria-label="Try again">🤔</span>}
              </div>
            )}
            {video && (
              <div className="flex flex-col items-center gap-3 animate-fade-in">
                <div className="font-semibold text-xl flex items-center gap-2">
                  <span role="img" aria-label="Video">🎬</span> {video.name}
                </div>
                <div className="w-full aspect-video max-w-lg rounded-2xl border-4 border-blue-200 bg-gradient-to-br from-blue-100 to-teal-100 shadow-lg overflow-hidden">
                  <iframe
                    src={`https://drive.google.com/file/d/${video.drive_id}/preview`}
                    width="100%"
                    height="215"
                    allow="autoplay"
                    allowFullScreen
                    className="rounded-xl w-full h-64"
                    title={video.name}
                  ></iframe>
                </div>
                <div className="mt-2 text-lg text-blue-700 flex items-center gap-1">
                  <span role="img" aria-label="Enjoy">👏</span> Enjoy learning!
                </div>
              </div>
            )}
            {!video && !error && (
              <div className="text-center text-blue-600 mt-4 text-lg animate-fade-in flex flex-col items-center gap-2">
                <span className="text-3xl">👋🤟</span>
                <span>Start your search above to discover sign language videos!</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuardComponent>
  );
}

// Animations (add to your global CSS or Tailwind config if not present):
// .animate-fade-in { animation: fadeIn 0.7s; }
// .animate-shake { animation: shake 0.4s; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
// @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
