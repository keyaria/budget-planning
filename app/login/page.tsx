"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NextResponse } from "next/server";

import type { Database } from "@/lib/database.types";
import {
  Paper,
  Group,
  Divider,
  Stack,
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Button,
  Text,
} from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
// import { type } from "os";
import { useForm } from "@mantine/form";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const supabase = createClientComponentClient<Database>();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    // const form = useForm({
    //   initialValues: {
    //     email: "",
    //     name: "",
    //     password: "",
    //     terms: true,
    //   },

    //   validate: {
    //     email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    //     password: (val) =>
    //       val.length <= 6
    //         ? "Password should include at least 6 characters"
    //         : null,
    //   },
    // });

    if (error) {
      setErrorMessage(error.message);
    } else {
      router.refresh();
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMessage(error.message);
    } else {
      router.refresh();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <main>
      {errorMessage && errorMessage}

      <Paper radius="md" p="xl" withBorder>
          <input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button onClick={handleSignUp}>Sign up</button>
          <button onClick={handleSignIn}>Sign in</button>
          <button onClick={handleSignOut}>Sign out</button>
      </Paper>
    </main>
  );
}
