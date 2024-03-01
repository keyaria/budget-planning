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
  Container,
  Title,
} from "@mantine/core";
import classes from "@/app/page.module.css";

import { upperFirst } from "@mantine/hooks";
// import { type } from "os";
import { useForm } from "@mantine/form";
import { SignInWithPasswordlessCredentials } from "@supabase/supabase-js";

interface FormValues {
  email: string;
  password: string;
}
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

    if (error) {
      setErrorMessage(error.message);
    } else {
      router.refresh();
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.values.email,
      password: form.values.password,
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

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          {...form.getInputProps("email")}
          error={form.errors.email && "Invalid email"}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps("password")}
          error={
            form.errors.password &&
            "Password should include at least 6 characters"
          }
          required
          mt="md"
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" onClick={handleSignIn}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}

// <main>
//   {errorMessage && errorMessage}

//   <Paper radius="md" p="xl" withBorder>
//       <input
//         name="email"
//         onChange={(e) => setEmail(e.target.value)}
//         value={email}
//       />
//       <input
//         type="password"
//         name="password"
//         onChange={(e) => setPassword(e.target.value)}
//         value={password}
//       />
//       <button onClick={handleSignUp}>Sign up</button>
//       <button onClick={handleSignIn}>Sign in</button>
//       <button onClick={handleSignOut}>Sign out</button>
//   </Paper>
// </main>
