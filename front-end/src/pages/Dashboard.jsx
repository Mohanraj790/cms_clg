import React from "react";
import {
  AppShell,
  Group,
  Title,
  Text,
  Card,
  Menu,
  Button,
  rem,
} from "@mantine/core";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import {
  IconChevronDown,
  IconLogout,
  IconSchool,
  IconLayoutDashboard,
} from "@tabler/icons-react";

// ✅ Import department pages
import CSE from "./departments/CSE";
import ECE from "./departments/ECE";
import IT from "./departments/IT";
import AI_DS from "./departments/AI_DS";
import Biomedical from "./departments/Biomedical";
import CyberSecurity from "./departments/CyberSecurity";
import Mechanical from "./departments/Mechanical";
import Humanities from "./departments/Humanities";
import Agricultural from "./departments/Agricultural";

const Dashboard = () => {
  const navigate = useNavigate();
  const maroon = "rgb(140, 21, 21)";
  const darkRed = "rgb(110, 15, 15)";

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppShell header={{ height: 70 }} padding="md">
      {/* ✅ Header Navbar */}
      <AppShell.Header
        style={{
          background: `linear-gradient(90deg, ${maroon} 0%, ${darkRed} 100%)`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* 🔹 Left Logo */}
        <Group>
          <IconLayoutDashboard size={26} color="white" />
          <Title order={3} style={{ color: "white", fontWeight: 700 }}>
            College Dashboard
          </Title>
        </Group>

        {/* 🔹 Center Menu */}
        <Group gap="xl">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              fontWeight: 700,
              borderBottom: "2px solid white",
              paddingBottom: "4px",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="#"
            style={{
              textDecoration: "none",
              color: "white",
              fontWeight: 600,
            }}
          >
            Admission
          </Link>

          {/* 🔻 About Dropdown */}
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} color="white" />}
                styles={{
                  root: {
                    color: "white",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: darkRed },
                  },
                }}
              >
                About
              </Button>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: maroon,
                border: `1px solid ${darkRed}`,
              }}
            >
              {["Vision & Mission", "History"].map((item, i) => (
                <Menu.Item
                  key={i}
                  style={{
                    color: "black",
                    fontWeight: 700,
                    backgroundColor: maroon,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkRed)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = maroon)
                  }
                >
                  {item}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* 🔻 Institutions Dropdown */}
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} color="white" />}
                styles={{
                  root: {
                    color: "white",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: darkRed },
                  },
                }}
              >
                Institutions
              </Button>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: maroon,
                border: `1px solid ${darkRed}`,
              }}
            >
              {["Engineering", "Arts"].map((item, i) => (
                <Menu.Item
                  key={i}
                  style={{
                    color: "black",
                    fontWeight: 700,
                    backgroundColor: maroon,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkRed)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = maroon)
                  }
                >
                  {item}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* 🔻 Departments Dropdown */}
          <Menu shadow="md" width={220}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} color="white" />}
                styles={{
                  root: {
                    color: "white",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: darkRed },
                  },
                }}
              >
                Departments
              </Button>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: maroon,
                border: `1px solid ${darkRed}`,
              }}
            >
              {[
                "CSE",
                "ECE",
                "IT",
                "AI & DS",
                "Biomedical",
                "Cyber Security",
                "Mechanical",
                "Humanities",
                "Agricultural",
              ].map((dept, i) => (
                <Menu.Item
                  key={i}
                  component={Link}
                  to={`departments/${dept
                    .toLowerCase()
                    .replace(" & ", "_")
                    .replace(" ", "")}`}
                  leftSection={<IconSchool size={14} color="black" />}
                  style={{
                    color: "black",
                    fontWeight: 700,
                    backgroundColor: maroon,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkRed)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = maroon)
                  }
                >
                  {dept}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* 🔻 Features Dropdown */}
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} color="white" />}
                styles={{
                  root: {
                    color: "white",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: darkRed },
                  },
                }}
              >
                Features
              </Button>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: maroon,
                border: `1px solid ${darkRed}`,
              }}
            >
              {["Library", "Placements"].map((item, i) => (
                <Menu.Item
                  key={i}
                  style={{
                    color: "black",
                    fontWeight: 700,
                    backgroundColor: maroon,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkRed)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = maroon)
                  }
                >
                  {item}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* 🔻 Contact Dropdown */}
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} color="white" />}
                styles={{
                  root: {
                    color: "white",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: darkRed },
                  },
                }}
              >
                Contact
              </Button>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: maroon,
                border: `1px solid ${darkRed}`,
              }}
            >
              {["Contact Us", "Support"].map((item, i) => (
                <Menu.Item
                  key={i}
                  style={{
                    color: "black",
                    fontWeight: 700,
                    backgroundColor: maroon,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = darkRed)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = maroon)
                  }
                >
                  {item}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* 🔹 Logout */}
        <Button
          variant="outline"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          styles={{
            root: {
              border: `2px solid white`,
              color: "white",
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "white",
                color: maroon,
              },
            },
          }}
        >
          Logout
        </Button>
      </AppShell.Header>

      {/* ✅ Main Content */}
      <AppShell.Main
        style={{
          backgroundColor: "#fffafa",
          paddingTop: rem(30),
          minHeight: "100vh",
        }}
      >
        <Card
          shadow="md"
          radius="lg"
          p="xl"
          style={{
            background: "white",
            border: `2px solid ${maroon}`,
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          }}
        >
          <Routes>
            <Route path="departments/cse" element={<CSE />} />
            <Route path="departments/ece" element={<ECE />} />
            <Route path="departments/it" element={<IT />} />
            <Route path="departments/ai_ds" element={<AI_DS />} />
            <Route path="departments/biomedical" element={<Biomedical />} />
            <Route path="departments/cybersecurity" element={<CyberSecurity />} />
            <Route path="departments/mechanical" element={<Mechanical />} />
            <Route path="departments/humanities" element={<Humanities />} />
            <Route path="departments/agricultural" element={<Agricultural />} />

            {/* Default Welcome Section */}
            <Route
              path="*"
              element={
                <Text ta="center" c={maroon} fz="lg" mt="md" fw={700}>
                  Welcome to the College Dashboard!  
                  <br />
                  This is your <strong style={{ color: darkRed }}>College Dashboard</strong>.  
                  <br />
                  Use the top menu to explore departments and features.
                </Text>
              }
            />
          </Routes>
        </Card>
      </AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
