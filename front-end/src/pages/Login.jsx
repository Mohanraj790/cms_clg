"use client";

import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Card,
  Title,
  Stack,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Axios instance

const Login = () => {
  const navigate = useNavigate();
  const maroon = "rgb(140, 21, 21)";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill all fields");
      setSuccess("");
      return;
    }

    try {
      // 🔥 Important: the correct route is /api/user/login (handled by Axios baseURL)
      const res = await api.post("/user/login", formData);

      // Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setError("");
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setSuccess("");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: `linear-gradient(135deg, ${maroon}, rgb(200, 60, 60))`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        shadow="lg"
        padding="xl"
        radius="lg"
        withBorder
        style={{
          width: 400,
          backgroundColor: "#fff",
          border: `2px solid ${maroon}`,
        }}
      >
        <Stack align="center" spacing="md">
          <Title order={2} style={{ color: maroon, fontWeight: 700 }}>
            Login
          </Title>

          {error && <Text c="red">{error}</Text>}
          {success && <Text c="green">{success}</Text>}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack>
              <TextInput
                label="Email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                radius="md"
                styles={{
                  input: { borderColor: maroon },
                  label: { color: maroon },
                }}
              />

              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                radius="md"
                styles={{
                  input: { borderColor: maroon },
                  label: { color: maroon },
                }}
              />

              <Button
                type="submit"
                fullWidth
                radius="md"
                style={{
                  backgroundColor: maroon,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm">
            Don’t have an account?{" "}
            <Text
              span
              fw={600}
              style={{ color: maroon, cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register
            </Text>
          </Text>
        </Stack>
      </Card>
    </div>
  );
};

export default Login;
