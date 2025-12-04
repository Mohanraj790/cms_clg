// src/pages/departments/IT.jsx
import React, { useState, useEffect } from "react";
import {
  AppShell,
  Group,
  Title,
  Button,
  Stack,
  TextInput,
  FileInput,
  Card,
  Text,
  Divider,
  ActionIcon,
  SimpleGrid,
  ScrollArea,
  Modal,
  Image,
  Table,
} from "@mantine/core";

import {
  IconChevronLeft,
  IconBuilding,
  IconPlus,
  IconTrash,
  IconFile,
  IconUsers,
  IconEdit,
  IconDownload,
  IconEye,
} from "@tabler/icons-react";

import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import api from "../../api/axios";

const IT = () => {
  const navigate = useNavigate();

  // =============== STATES =============== //

  const [title, setTitle] = useState("");
  const [titles, setTitles] = useState([]);
  const [activeTitle, setActiveTitle] = useState(null);

  // Faculty
  const [people, setPeople] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [facultyDesignation, setFacultyDesignation] = useState("");
  const [facultyPhoto, setFacultyPhoto] = useState(null);
  const [editFaculty, setEditFaculty] = useState(null);
  const [openFacultyModal, setOpenFacultyModal] = useState(false);

  // PDF
  const [pdfs, setPdfs] = useState([]);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [editPDF, setEditPDF] = useState(null);
  const [openPDFModal, setOpenPDFModal] = useState(false);

  // Sheet
  const [sheetTitle, setSheetTitle] = useState("");
  const [sheetFile, setSheetFile] = useState(null);
  const [openSheetModal, setOpenSheetModal] = useState(false);

  // Sheet List - CHANGED TO NULL FOR BETTER DEBUGGING
  const [sheets, setSheets] = useState(null);

  // Sheet Preview Modal (table data)
  const [openSheetPreview, setOpenSheetPreview] = useState(false);
  const [sheetPreviewData, setSheetPreviewData] = useState(null);
  const [loadingSheetPreview, setLoadingSheetPreview] = useState(false);

  // PDF Preview Modal
  const [openPDFPreview, setOpenPDFPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");

  // Image Preview
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const BASE_URL = "http://localhost:4000";
  const maroon = "rgb(140, 21, 21)";
  const darkRed = "rgb(110, 15, 15)";

  // =============== LOAD SECTIONS =============== //

  useEffect(() => {
    const loadSections = async () => {
      try {
        const res = await api.get("/departments/it/sections");
        if (res.data.ok) {
          setTitles(res.data.data.map((s) => ({ id: s.id, name: s.title })));
        }
      } catch (error) {
        // console.error("Load sections error:", error);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed to load sections",
        });
      }
    };
    loadSections();
  }, []);

  // =============== LOAD PEOPLE + PDFs + SHEETS =============== //

  useEffect(() => {
    if (!activeTitle) return;

    const loadData = async () => {
      try {
        // console.log("🔄 Loading data for section:", activeTitle.id);

        // Load People
        const peopleRes = await api.get(
          `/departments/it/sections/${activeTitle.id}/people`
        );
        // console.log("👥 People response:", peopleRes.data);
        if (peopleRes.data.ok) {
          setPeople(peopleRes.data.data);
        }

        // Load PDFs
        const pdfsRes = await api.get(
          `/departments/it/sections/${activeTitle.id}/files`
        );
        console.log("📄 PDFs response:", pdfsRes.data);
        if (pdfsRes.data.ok) {
          setPdfs(pdfsRes.data.data);
        }

        // Load Excel files - WITH DETAILED DEBUGGING
        // console.log("📊 Attempting to load Excel files...");
        try {
          const sheetsRes = await api.get(
            `/departments/it/sections/${activeTitle.id}/all`
          );
          // console.log("📊 Excel sheets FULL response:", sheetsRes);
          // console.log("📊 Excel sheets data:", sheetsRes.data);

          if (sheetsRes.data.ok) {
            // console.log("✅ Sheets loaded successfully:", sheetsRes.data.data);
            // console.log("✅ Number of sheets:", sheetsRes.data.data.length);
            setSheets(sheetsRes.data.data);
          } else {
            // console.log("❌ Sheets response not ok:", sheetsRes.data);
            setSheets([]);
          }
        } catch (excelError) {
          // console.error("❌ Excel load error:", excelError);
          // console.error("Error response:", excelError.response?.data);
          // console.error("Error status:", excelError.response?.status);
          setSheets([]);
        }

      } catch (error) {
        // console.error("❌ Load data error:", error);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed loading section data",
        });
      }
    };

    loadData();
  }, [activeTitle]);

  // Debug sheets state changes
  useEffect(() => {
    // console.log("📊 Sheets state updated:", sheets);
    // console.log("📊 Sheets type:", typeof sheets);
    // console.log("📊 Is array?", Array.isArray(sheets));
    if (Array.isArray(sheets)) {
      // console.log("📊 Sheets length:", sheets.length);
    }
  }, [sheets]);

  // =============== ADD SECTION =============== //

  const handleAddTitle = async () => {
    if (!title.trim()) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Enter a section title",
      });
    }

    try {
      const res = await api.post(`/departments/it/sections`, { title });

      const newSec = { id: res.data.data.id, name: res.data.data.title };
      setTitles([...titles, newSec]);
      setActiveTitle(newSec);
      setTitle("");

      notifications.show({
        color: "green",
        title: "Success",
        message: "Section added",
      });
    } catch (error) {
      // console.error("Add section error:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to add section",
      });
    }
  };

  // =============== ADD SHEET =============== //

  const handleSaveSheet = async () => {
    if (!sheetTitle || !sheetFile || !activeTitle) {
      return notifications.show({
        color: "red",
        title: "Required",
        message: "Fill all fields",
      });
    }

    const fd = new FormData();
    fd.append("sheetName", sheetTitle);
    fd.append("file", sheetFile);

    // console.log("📤 Uploading Excel file:", {
    //   title: sheetTitle,
    //   file: sheetFile,
    //   sectionId: activeTitle.id
    // });

    try {
      const response = await api.post(
        `/departments/it/sections/${activeTitle.id}/excel/upload`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // console.log("✅ Upload success:", response.data);

      notifications.show({
        color: "green",
        title: "Success",
        message: "Sheet uploaded successfully",
      });

      setSheetTitle("");
      setSheetFile(null);
      setOpenSheetModal(false);
      await loadSheets();

      // Reload sheets after upload
      try {
        const sheetsRes = await api.get(
          `/departments/it/sections/${activeTitle.id}/excel/files`
        );
        // console.log("🔄 Reloaded sheets:", sheetsRes.data);
        if (sheetsRes.data.ok) {
          setSheets(sheetsRes.data.data);
        }
      } catch (reloadError) {
        // console.error("❌ Reload sheets error:", reloadError);
      }
    } catch (error) {
      // console.error("❌ Upload sheet error:", error);
      // console.error("Error details:", error.response?.data);

      notifications.show({
        color: "red",
        title: "Upload Failed",
        message: error.response?.data?.message || "Failed to upload sheet",
      });
    }
  };

  // =============== OPEN SHEET PREVIEW (TABLE) =============== //

  const handleOpenSheetPreview = async (sheet) => {
    setLoadingSheetPreview(true);
    setSheetPreviewData(null);
    setOpenSheetPreview(true);

    try {
      // console.log("🔍 Opening sheet preview for:", sheet.id);

      // Try to get sheet data preview
      try {
        const res = await api.get(
          `/departments/it/sections/${activeTitle.id}/excel/files/${sheet.id}`
        );

        // console.log("📊 Sheet preview response:", res.data);

        if (res.data?.ok) {
          setSheetPreviewData({
            file: res.data.file,
            rows: res.data.rows || [],
            downloadUrl: res.data.file?.downloadUrl || `${BASE_URL}/uploads/excel/${sheet.filename}`
          });
        } else {
          throw new Error("No preview data available");
        }
      } catch (previewError) {
        // Fallback: Just show download option
        setSheetPreviewData({
          file: sheet,
          rows: [],
          downloadUrl: `${BASE_URL}/uploads/excel/${sheet.filename}`,
          message: "Table preview not available. Download the file to view it."
        });
      }
    } catch (error) {
      // Final fallback
      setSheetPreviewData({
        file: sheet,
        rows: [],
        downloadUrl: `${BASE_URL}/uploads/excel/${sheet.filename}`,
        message: "Preview not available. You can download the file to view it."
      });
    } finally {
      setLoadingSheetPreview(false);
    }
  };

  // =============== OPEN PDF PREVIEW =============== //

  const handleOpenPDFPreview = (pdf) => {
    let pdfUrl = pdf.path;
    if (!pdf.path.startsWith('http')) {
      pdfUrl = pdf.path.startsWith('/')
        ? `${BASE_URL}${pdf.path}`
        : `${BASE_URL}/${pdf.path}`;
    }
    // console.log("Opening PDF:", pdfUrl);
    setPdfPreviewUrl(pdfUrl);
    setOpenPDFPreview(true);
  };

  // =============== DOWNLOAD PDF =============== //

  const handleDownloadPDF = (pdf) => {
    let downloadUrl = pdf.path;
    if (!pdf.path.startsWith('http')) {
      downloadUrl = pdf.path.startsWith('/')
        ? `${BASE_URL}${pdf.path}`
        : `${BASE_URL}/${pdf.path}`;
    }
    window.open(downloadUrl, '_blank');
  };

  const readableSize = (size) => {
    if (!size) return "—";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB"];
    return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  // =============== RENDER EXCEL TABLE =============== //

  const renderExcelTable = (rows) => {
    if (!rows || rows.length === 0) {
      return (
        <Text c="orange" ta="center" py="xl">
          No data available in this sheet
        </Text>
      );
    }

    const headers = rows[0] || [];

    return (
      <ScrollArea h={400}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {headers.map((header, index) => (
                <Table.Th key={index} style={{ backgroundColor: '#faf3f3', color: maroon }}>
                  {header || `Column ${index + 1}`}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.slice(1).map((row, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Table.Td key={cellIndex}>
                    {cell?.toString() || ""}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    );
  };

  // =============== TEST FUNCTION =============== //

  const testExcelAPI = async () => {
    if (!activeTitle) {
      // console.log("❌ No active title selected");
      notifications.show({
        color: "red",
        title: "Error",
        message: "Please select a section first",
      });
      return;
    }

    try {
      // console.log("🧪 Testing Excel API...");
      const response = await fetch(
        `http://localhost:4000/departments/it/sections/${activeTitle.id}/excel/files`
      );
      const data = await response.json();
      // console.log("🔍 Direct fetch response:", data);

      if (data.ok && Array.isArray(data.data)) {
        // console.log("✅ Correct data structure");
        // console.log("📊 Sheets found:", data.data.length);
        data.data.forEach((sheet, index) => {
          // console.log(`Sheet ${index}:`, sheet);
        });
        setSheets(data.data);
      } else {
        // console.log("❌ Unexpected data structure:", data);
        notifications.show({
          color: "orange",
          title: "API Test",
          message: "Unexpected response format",
        });
      }
    } catch (error) {
      // console.error("❌ Test fetch error:", error);
      notifications.show({
        color: "red",
        title: "API Test Failed",
        message: "Could not connect to Excel API",
      });
    }
  };

  return (
    <>
      {/* SHEET UPLOAD MODAL */}
      <Modal
        opened={openSheetModal}
        onClose={() => setOpenSheetModal(false)}
        title="Add Excel Sheet"
        centered
      >
        <Stack>
          <TextInput
            label="Sheet Title"
            value={sheetTitle}
            onChange={(e) => setSheetTitle(e.target.value)}
            placeholder="Enter sheet title"
            required
          />

          <FileInput
            label="Upload Excel File (.xlsx, .xls, .csv)"
            accept=".xlsx,.xls,.csv"
            onChange={setSheetFile}
            placeholder="Choose Excel file"
            required
          />

          <Button color={maroon} onClick={handleSaveSheet}>
            Upload Sheet
          </Button>

          {/* Debug button */}
          <Button
            variant="outline"
            color="orange"
            onClick={() => {
              // console.log("Current sheets state:", sheets);
              // console.log("Active title:", activeTitle);
            }}
          >
            Debug State
          </Button>
        </Stack>
      </Modal>

      {/* SHEET PREVIEW (TABLE) */}
      <Modal
        opened={openSheetPreview}
        onClose={() => {
          setOpenSheetPreview(false);
          setSheetPreviewData(null);
        }}
        title="Excel Sheet Preview"
        size="xl"
        centered
      >
        <Stack>
          {loadingSheetPreview && (
            <Text ta="center" py="xl">Loading sheet data…</Text>
          )}

          {!loadingSheetPreview && sheetPreviewData && (
            <>
              <Text fw={700} size="lg" c={maroon}>
                {sheetPreviewData.file?.originalName ||
                  sheetPreviewData.file?.sheetName ||
                  sheetPreviewData.file?.filename}
              </Text>

              {sheetPreviewData.message && (
                <Text c="orange" ta="center" mb="md">
                  {sheetPreviewData.message}
                </Text>
              )}

              {sheetPreviewData.rows && sheetPreviewData.rows.length > 0 ? (
                <>
                  <Text size="sm" c="dimmed">
                    Showing {sheetPreviewData.rows.length - 1} data rows
                  </Text>

                  {renderExcelTable(sheetPreviewData.rows)}

                  <Group mt="md" justify="center">
                    <Button
                      component="a"
                      href={sheetPreviewData.downloadUrl}
                      target="_blank"
                      leftSection={<IconDownload size={16} />}
                      color={maroon}
                    >
                      Download Excel File
                    </Button>
                  </Group>
                </>
              ) : (
                <Stack align="center" py="xl">
                  <Text c="orange" ta="center">
                    No preview data available
                  </Text>
                  <Button
                    component="a"
                    href={sheetPreviewData.downloadUrl}
                    target="_blank"
                    leftSection={<IconDownload size={16} />}
                    color={maroon}
                  >
                    Download File to View
                  </Button>
                </Stack>
              )}
            </>
          )}
        </Stack>
      </Modal>

      {/* PDF PREVIEW MODAL */}
      <Modal
        opened={openPDFPreview}
        onClose={() => setOpenPDFPreview(false)}
        title="PDF Preview"
        size="xl"
        centered
      >
        <Stack>
          {pdfPreviewUrl ? (
            <>
              <iframe
                src={pdfPreviewUrl}
                width="100%"
                height="600px"
                style={{ border: "none", borderRadius: "8px" }}
                title="PDF Preview"
              />
              <Group justify="center">
                <Button
                  component="a"
                  href={pdfPreviewUrl}
                  target="_blank"
                  leftSection={<IconDownload size={16} />}
                  color={maroon}
                >
                  Download PDF
                </Button>
              </Group>
            </>
          ) : (
            <Text c="red" ta="center">
              PDF not available for preview
            </Text>
          )}
        </Stack>
      </Modal>

      {/* FACULTY MODAL */}
      <Modal
        opened={openFacultyModal}
        onClose={() => {
          setOpenFacultyModal(false);
          setEditFaculty(null);
          setFacultyName("");
          setFacultyDesignation("");
          setFacultyPhoto(null);
        }}
        title={editFaculty ? "Edit Faculty" : "Add Faculty"}
        centered
      >
        <Stack>
          <TextInput
            label="Full Name"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            placeholder="Enter faculty name"
            required
          />

          <TextInput
            label="Designation"
            value={facultyDesignation}
            onChange={(e) => setFacultyDesignation(e.target.value)}
            placeholder="Enter designation"
            required
          />

          <FileInput
            label="Upload Photo"
            accept="image/*"
            onChange={setFacultyPhoto}
            placeholder="Choose photo"
          />

          <Button color={maroon} onClick={handleSaveFaculty}>
            {editFaculty ? "Update Faculty" : "Add Faculty"}
          </Button>
        </Stack>
      </Modal>

      {/* PDF MODAL */}
      <Modal
        opened={openPDFModal}
        onClose={() => {
          setOpenPDFModal(false);
          setEditPDF(null);
          setPdfTitle("");
          setPdfFile(null);
        }}
        title={editPDF ? "Edit PDF" : "Add PDF"}
        centered
      >
        <Stack>
          <TextInput
            label="PDF Title"
            value={pdfTitle}
            onChange={(e) => setPdfTitle(e.target.value)}
            placeholder="Enter PDF title"
            required
          />

          <FileInput
            label="Upload PDF"
            accept="application/pdf"
            onChange={setPdfFile}
            placeholder="Choose PDF file"
          />

          <Button color={maroon} onClick={handleSavePDF}>
            {editPDF ? "Update PDF" : "Upload PDF"}
          </Button>
        </Stack>
      </Modal>

      {/* IMAGE PREVIEW */}
      <Modal
        opened={openPreview}
        onClose={() => setOpenPreview(false)}
        centered
        size="xl"
        title="Image Preview"
      >
        <Image
          src={previewUrl}
          fit="contain"
          radius="md"
          style={{ width: "100%", maxHeight: "80vh" }}
        />
      </Modal>

      {/* MAIN UI */}
      <AppShell padding="md" header={{ height: 60 }} navbar={{ width: 300 }}>
        {/* HEADER */}
        <AppShell.Header
          style={{
            background: `linear-gradient(90deg, ${maroon}, ${darkRed})`,
            color: "white",
          }}
        >
          <Group justify="space-between" px="md" h="100%">
            <Group>
              <Button
                variant="white"
                color={maroon}
                leftSection={<IconChevronLeft size={16} />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>

              <Group>
                <IconBuilding size={22} color="white" />
                <Title order={4} c="white">
                  IT
                </Title>
              </Group>
            </Group>

            {/* Debug button in header */}
            <Button
              variant="light"
              color="orange"
              size="sm"
              onClick={testExcelAPI}
            >
              Test Excel API
            </Button>
          </Group>
        </AppShell.Header>

        {/* SIDEBAR */}
        <AppShell.Navbar
          p="md"
          style={{
            backgroundColor: "#fff5f5",
            borderRight: `3px solid ${maroon}`,
            height: "calc(100vh - 60px)", // full screen height - header
            marginTop: 60, // header offset
            paddingBottom: 0,
            overflow: "hidden",
          }}
        >

           <ScrollArea style={{ height: "100%" }}>
            <Stack>
              <TextInput
                label="New Section"
                value={title}
                placeholder="Add Section…"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTitle()}
              />

              <Button
                fullWidth
                leftSection={<IconPlus size={16} />}
                onClick={handleAddTitle}
                styles={{
                  root: {
                    background: `linear-gradient(90deg, ${maroon}, ${darkRed})`,
                    '&:hover': {
                      background: `linear-gradient(90deg, ${darkRed}, ${maroon})`,
                    }
                  },
                }}
              >
                Add Section
              </Button>

              <Divider color={maroon} my="sm" />

              <Text fw={600} c={maroon} size="sm">Sections:</Text>

              {titles.map((t) => (
                <Card
                  key={t.id}
                  p="sm"
                  withBorder
                  onClick={() => setActiveTitle(t)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: activeTitle?.id === t.id ? "#ffecec" : "white",
                    border:
                      activeTitle?.id === t.id
                        ? `2px solid ${maroon}`
                        : "1px solid #ccc",
                    transition: "all 0.2s",
                  }}
                >
                  <Group justify="space-between">
                    <Text fw={700} c={maroon} size="sm">
                      {t.name}
                    </Text>

                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(t.id);
                      }}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Stack>
          </ScrollArea>

        </AppShell.Navbar>


        {/* MAIN CONTENT */}
        <AppShell.Main style={{ paddingTop: 80, backgroundColor: "#fffafa" }}>
          {activeTitle ? (
            <Card
              shadow="xl"
              p="xl"
              style={{
                maxWidth: 1200,
                margin: "auto",
                border: `2px solid ${maroon}`,
                backgroundColor: "white",
              }}
            >
              <Title ta="center" order={2} c={maroon} mb="lg">
                {activeTitle.name}
              </Title>

              <Group justify="center" mb="xl" gap="md">
                <Button
                  color={maroon}
                  leftSection={<IconUsers size={18} />}
                  onClick={() => setOpenFacultyModal(true)}
                  size="md"
                >
                  Add Faculty
                </Button>

                <Button
                  color={maroon}
                  leftSection={<IconFile size={18} />}
                  onClick={() => setOpenPDFModal(true)}
                  size="md"
                >
                  Add PDF
                </Button>

                <Button
                  color={maroon}
                  leftSection={<IconFile size={18} />}
                  onClick={() => setOpenSheetModal(true)}
                  size="md"
                >
                  Add Excel Sheet
                </Button>

                {/* Debug button */}
                <Button
                  color="orange"
                  variant="outline"
                  leftSection={<IconEye size={18} />}
                  onClick={testExcelAPI}
                  size="md"
                >
                  Debug Sheets
                </Button>
              </Group>

              {/* FACULTY LIST */}
              <Title order={3} c={maroon} mb="md">
                Faculty Members ({people.length})
              </Title>

              {people.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt="md">
                  {people.map((f) => {
                    const img = f.photo ? `${BASE_URL}${f.photo}` : '/default-avatar.png';
                    return (
                      <Card withBorder key={f.id} p="md" shadow="sm">
                        <Card.Section>
                          <Image
                            src={img}
                            height={220}
                            fit="cover"
                            radius="md"
                            onClick={() => {
                              setPreviewUrl(img);
                              setOpenPreview(true);
                            }}
                            style={{ cursor: "pointer" }}
                            alt={f.name}
                          />
                        </Card.Section>

                        <Text fw={700} ta="center" mt="md" size="lg">
                          {f.name}
                        </Text>
                        <Text ta="center" c="dimmed" mb="xs">
                          {f.designation}
                        </Text>

                        <Group justify="center" mt="sm">
                          <ActionIcon
                            color="blue"
                            variant="light"
                            onClick={() => {
                              setEditFaculty(f);
                              setFacultyName(f.name);
                              setFacultyDesignation(f.designation);
                              setOpenFacultyModal(true);
                            }}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>

                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => handleDeleteFaculty(f.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  No faculty members added yet
                </Text>
              )}

              <Divider my="xl" color={maroon} />

              {/* ================= PDF LIST ================= */}
              <Title order={3} c={maroon} mb="md">
                PDF Documents ({pdfs.length})
              </Title>

              {pdfs.length > 0 ? (
                <Stack mt="sm" gap="md">
                  {pdfs.map((pdf) => (
                    <Card key={pdf.id} p="md" withBorder shadow="sm">
                      <Group justify="space-between" align="center">
                        <Group>
                          <IconFile size={24} color={maroon} />
                          <div>
                            <Text fw={600} size="lg">{pdf.title}</Text>
                            <Text size="sm" c="dimmed">
                              Size: {readableSize(pdf.size)} •
                              Added: {new Date(pdf.createdAt).toLocaleDateString()}
                            </Text>
                          </div>
                        </Group>

                        <Group gap="xs">
                          <Button
                            size="sm"
                            leftSection={<IconEye size={16} />}
                            onClick={() => handleOpenPDFPreview(pdf)}
                            variant="light"
                            color={maroon}
                          >
                            View
                          </Button>

                          <Button
                            size="sm"
                            leftSection={<IconDownload size={16} />}
                            onClick={() => handleDownloadPDF(pdf)}
                            variant="outline"
                            color="green"
                          >
                            Download
                          </Button>

                          <ActionIcon
                            color="blue"
                            variant="light"
                            onClick={() => {
                              setEditPDF(pdf);
                              setPdfTitle(pdf.title);
                              setOpenPDFModal(true);
                            }}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>

                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => handleDeletePDF(pdf.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  No PDF documents uploaded yet
                </Text>
              )}

              <Divider my="xl" color={maroon} />

              {/* ================= SHEET LIST ================= */}
              <Title order={3} c={maroon} mb="md">
                Excel Sheets ({sheets === null ? 'Loading...' : sheets.length})
              </Title>

              {/* DEBUG INFO */}
              <Card p="md" withBorder mb="md" style={{ backgroundColor: '#fff0f0', display: 'none' }}>
                <Text size="sm" c="red">
                  Debug: Sheets = {JSON.stringify(sheets, null, 2)}
                </Text>
                <Text size="sm" c="red">
                  Type: {typeof sheets}, Is Array: {Array.isArray(sheets) ? 'Yes' : 'No'}
                </Text>
              </Card>

              {sheets === null ? (
                <Card p="xl" withBorder style={{ textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                  <Text c="blue" size="lg">
                    Loading Excel sheets...
                  </Text>
                </Card>
              ) : sheets && sheets.length > 0 ? (
                <Stack mt="sm" gap="md">
                  {sheets.map((sheet, index) => {
                    // console.log(`Rendering sheet ${index}:`, sheet);
                    return (
                      <Card key={sheet.id || index} p="md" withBorder shadow="sm">
                        <Group justify="space-between" align="center">
                          <Group>
                            <IconFile size={24} color={maroon} />
                            <div>
                              <Text fw={600} size="lg">
                                {sheet.originalName || sheet.sheetName || sheet.filename || `Sheet ${index + 1}`}
                              </Text>
                              <Text size="sm" c="dimmed">
                                ID: {sheet.id} •
                                Size: {readableSize(sheet.size)} •
                                Added: {sheet.createdAt ? new Date(sheet.createdAt).toLocaleDateString() : 'Unknown'}
                              </Text>
                            </div>
                          </Group>

                          <Group gap="xs">
                            <Button
                              size="sm"
                              leftSection={<IconEye size={16} />}
                              onClick={() => handleOpenSheetPreview(sheet)}
                              variant="light"
                              color={maroon}
                            >
                              View
                            </Button>

                            <Button
                              size="sm"
                              leftSection={<IconDownload size={16} />}
                              component="a"
                              href={`${BASE_URL}/uploads/excel/${sheet.filename}`}
                              target="_blank"
                              variant="outline"
                              color="green"
                            >
                              Download
                            </Button>

                            <ActionIcon
                              color="red"
                              variant="light"
                              onClick={() => handleDeleteSheet(sheet.id)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Card>
                    );
                  })}
                </Stack>
              ) : (
                <Card p="xl" withBorder style={{ textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                  <Text c="dimmed" size="lg">
                    No Excel sheets uploaded yet
                  </Text>
                  <Text size="sm" c="orange" mt="sm">
                    Use "Add Excel Sheet" button to upload your first spreadsheet
                  </Text>
                </Card>
              )}
            </Card>
          ) : (
            <Card
              shadow="lg"
              p="xl"
              style={{
                width: "50%",
                margin: "15% auto",
                border: `2px solid ${maroon}`,
                textAlign: "center",
              }}
            >
              <Title ta="center" c={maroon} order={2} mb="md">
                Welcome to IT Department
              </Title>
              <Divider my="md" color={maroon} />
              <Text size="lg" c="dimmed">
                Select a section from the sidebar to view and manage content
              </Text>
            </Card>
          )}
        </AppShell.Main>
      </AppShell>
    </>
  );

  // ================= helper & CRUD functions ================= //

  async function handleSaveFaculty() {
    if (!facultyName || !facultyDesignation || !activeTitle) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Please fill all faculty fields",
      });
    }

    const fd = new FormData();
    fd.append("name", facultyName);
    fd.append("designation", facultyDesignation);
    if (facultyPhoto) fd.append("photo", facultyPhoto);

    try {
      let res;
      if (editFaculty) {
        res = await api.patch(
          `/departments/it/sections/${activeTitle.id}/people/${editFaculty.id}`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setPeople((prev) =>
          prev.map((p) => (p.id === editFaculty.id ? res.data.data : p))
        );
      } else {
        res = await api.post(
          `/departments/it/sections/${activeTitle.id}/people`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setPeople((prev) => [...prev, res.data.data]);
      }

      setFacultyName("");
      setFacultyDesignation("");
      setFacultyPhoto(null);
      setEditFaculty(null);
      setOpenFacultyModal(false);

      notifications.show({
        color: "green",
        title: "Success",
        message: editFaculty ? "Faculty updated successfully" : "Faculty added successfully",
      });
    } catch (err) {
      // console.error("Save faculty error:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to save faculty information",
      });
    }
  }

  async function handleDeleteFaculty(id) {
    try {
      await api.delete(
        `/departments/it/sections/${activeTitle.id}/people/${id}`
      );
      setPeople((prev) => prev.filter((p) => p.id !== id));

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Faculty member removed successfully",
      });
    } catch (err) {
      // console.error("Delete faculty error:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete faculty member",
      });
    }
  }

  async function handleSavePDF() {
    if (!pdfTitle || !activeTitle) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Please enter PDF title",
      });
    }

    const fd = new FormData();
    fd.append("title", pdfTitle);
    if (pdfFile) fd.append("file", pdfFile);

    try {
      let res;
      if (editPDF) {
        res = await api.patch(
          `/departments/it/sections/${activeTitle.id}/files/${id}`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setPdfs((prev) => prev.map((p) => (p.id === editPDF.id ? res.data.data : p)));
      } else {
        res = await api.post(
          `/departments/it/sections/${activeTitle.id}/files`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setPdfs((prev) => [res.data.data, ...prev]);
      }

      setPdfTitle("");
      setPdfFile(null);
      setEditPDF(null);
      setOpenPDFModal(false);

      notifications.show({
        color: "green",
        title: "Success",
        message: editPDF ? "PDF updated successfully" : "PDF uploaded successfully",
      });
    } catch (err) {
      // console.error("Save PDF error:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Failed to upload PDF",
      });
    }
  }

  async function handleDeletePDF(id) {
    try {
      await api.delete(
        `/departments/it/sections/${activeTitle.id}/files/${id}`
      );
      setPdfs((prev) => prev.filter((p) => p.id !== id));

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "PDF removed successfully",
      });
    } catch (err) {
      // console.error("Delete PDF error:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete PDF",
      });
    }
  }

  async function handleDeleteSheet(id) {
    try {
      await api.delete(`/departments/it/sections/${activeTitle.id}/excel/files/${id}`);
      setSheets((prev) => prev.filter((s) => s.id !== id));

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Excel sheet removed successfully",
      });
    } catch (err) {
      // console.error("Delete sheet error:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete Excel sheet",
      });
    }
  }

  async function handleDeleteSection(sectionId) {
    try {
      await api.delete(`/departments/it/sections/${sectionId}`);
      setTitles((prev) => prev.filter((t) => t.id !== sectionId));

      if (activeTitle?.id === sectionId) {
        setActiveTitle(null);
        setSheets(null); // Reset sheets when section is deleted
      }

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Section removed successfully",
      });
    } catch (err) {
      // console.error("Delete section error:", err);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete section",
      });
    }
  }
};

export default IT;
