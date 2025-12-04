import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Card,
  Title,
  Stack,
  Text,
  Select,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // axios instance

const Register = () => {
  const navigate = useNavigate();
  const maroon = "rgb(140, 21, 21)";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Text inputs change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Role select change
  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, role } = formData;
    if (!name || !email || !password || !role) {
      setError("All fields are required!");
      setSuccess("");
      return;
    }

    try {
      const res = await api.post("/user/register", formData);

      setSuccess("Registration successful! Redirecting to login...");
      setError("");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        <Stack align="center">
          <Title order={2} style={{ color: maroon, fontWeight: 700 }}>
            Register
          </Title>

          {error && <Text c="red">{error}</Text>}
          {success && <Text c="green">{success}</Text>}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack>
              <TextInput
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                radius="md"
                styles={{
                  input: { borderColor: maroon },
                  label: { color: maroon },
                }}
              />

              <TextInput
                label="Email Address"
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

              <Select
                label="Select Role"
                placeholder="Choose role"
                data={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
                value={formData.role}
                onChange={handleRoleChange}
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
                  fontWeight: 700,
                }}
              >
                Register
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm">
            Already have an account?{" "}
            <Text
              span
              fw={600}
              style={{ color: maroon, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Login
            </Text>
          </Text>
        </Stack>
      </Card>
    </div>
  );
};

export default Register;
