// src/pages/departments/CSE.jsx
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
  Textarea,
  Grid,
  Box,
  Badge,
  Loader,
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
  IconInfoCircle,
  IconPhoto,
  IconTextSize,
  IconNote,
} from "@tabler/icons-react";

import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import api from "../../api/axios";

const CSE = () => {
  const navigate = useNavigate();

  // =============== STATES =============== //
  const [title, setTitle] = useState("");
  const [titles, setTitles] = useState([]);
  const [activeTitle, setActiveTitle] = useState(null);
  const [activeSubSection, setActiveSubSection] = useState(null);
  
  // Faculty
  const [people, setPeople] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const [facultyDesignation, setFacultyDesignation] = useState("");
  const [facultyAbout, setFacultyAbout] = useState("");
  const [facultyPhoto, setFacultyPhoto] = useState(null);
  const [editFaculty, setEditFaculty] = useState(null);
  const [openFacultyModal, setOpenFacultyModal] = useState(false);

  // PDF
  const [pdfs, setPdfs] = useState([]);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [editPDF, setEditPDF] = useState(null);
  const [openPDFModal, setOpenPDFModal] = useState(false);

  // Excel Sheets
  const [sheetTitle, setSheetTitle] = useState("");
  const [sheetFile, setSheetFile] = useState(null);
  const [openSheetModal, setOpenSheetModal] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [loadingSheets, setLoadingSheets] = useState(false);

  // Content
  const [contents, setContents] = useState([]);
  const [loadingContents, setLoadingContents] = useState(false);
  const [openContentModal, setOpenContentModal] = useState(false);
  const [contentId, setContentId] = useState(null);
  const [contentText, setContentText] = useState("");
  const [contentPhoto, setContentPhoto] = useState(null);

  // Subsections
  const [subSectionsMap, setSubSectionsMap] = useState({});
  const [openSubtopicModal, setOpenSubtopicModal] = useState(false);
  const [subtopicParent, setSubtopicParent] = useState(null);
  const [subtopicTitle, setSubtopicTitle] = useState("");
  const [subtopicDescription, setSubtopicDescription] = useState("");

  // Modals
  const [openSubtopicDetailsModal, setOpenSubtopicDetailsModal] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [openAboutModal, setOpenAboutModal] = useState(false);
  const [selectedFacultyAbout, setSelectedFacultyAbout] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openPDFPreview, setOpenPDFPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
  const [openSheetPreview, setOpenSheetPreview] = useState(false);
  const [sheetPreviewData, setSheetPreviewData] = useState(null);
  const [loadingSheetPreview, setLoadingSheetPreview] = useState(false);

  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:4000";
  const maroon = "rgb(140, 21, 21)";
  const darkRed = "rgb(110,15, 15)";

  // =============== HELPER FUNCTIONS =============== //

  const getBasePath = () => {
    if (!activeTitle) return null;
    
    const departmentSlug = "cse";
    
    if (activeSubSection) {
      return `/departments/${departmentSlug}/sections/${activeTitle.id}/subsections/${activeSubSection.id}`;
    }
    return `/departments/${departmentSlug}/sections/${activeTitle.id}`;
  };

  const getContentApiUrl = () => {
    if (!activeTitle) return null;
    
    const departmentSlug = "cse";
    
    if (activeSubSection) {
      return `/departments/${departmentSlug}/sections/${activeTitle.id}/subsections/${activeSubSection.id}/contents`;
    }
    return `/departments/${departmentSlug}/sections/${activeTitle.id}/contents`;
  };

  // Function to render content with HTML support
  const renderContent = (contentString) => {
    if (!contentString) return null;
    
    try {
      // Check if it's JSON (from old rich text editor)
      const parsed = JSON.parse(contentString);
      if (parsed && parsed.content) {
        // If it's JSON, convert to HTML
        const html = convertJsonToHTML(parsed);
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      }
    } catch (error) {
      // If not JSON, check if it contains HTML tags
      if (contentString.includes('<') && contentString.includes('>')) {
        // It's already HTML
        return <div dangerouslySetInnerHTML={{ __html: contentString }} />;
      } else {
        // Plain text
        return <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{contentString}</Text>;
      }
    }
  };

  const convertJsonToHTML = (json) => {
    if (!json.content) return '';
    
    const convertNode = (node) => {
      if (!node) return '';
      
      if (node.type === 'text') {
        let text = node.text || '';
        if (node.marks) {
          node.marks.forEach(mark => {
            if (mark.type === 'bold') text = `<strong>${text}</strong>`;
            else if (mark.type === 'italic') text = `<em>${text}</em>`;
            else if (mark.type === 'underline') text = `<u>${text}</u>`;
            else if (mark.type === 'strike') text = `<s>${text}</s>`;
          });
        }
        return text;
      }
      
      if (node.type === 'paragraph') {
        const children = node.content ? node.content.map(convertNode).join('') : '';
        return `<p>${children}</p>`;
      }
      
      if (node.type === 'heading') {
        const level = node.attrs?.level || 2;
        const children = node.content ? node.content.map(convertNode).join('') : '';
        return `<h${level}>${children}</h${level}>`;
      }
      
      if (node.type === 'bullet_list') {
        const children = node.content ? node.content.map(convertNode).join('') : '';
        return `<ul>${children}</ul>`;
      }
      
      if (node.type === 'ordered_list') {
        const children = node.content ? node.content.map(convertNode).join('') : '';
        return `<ol>${children}</ol>`;
      }
      
      if (node.type === 'list_item') {
        const children = node.content ? node.content.map(convertNode).join('') : '';
        return `<li>${children}</li>`;
      }
      
      return '';
    };
    
    return json.content.map(convertNode).join('');
  };

  // =============== LOAD SECTIONS =============== //

  useEffect(() => {
    const loadSections = async () => {
      setLoading(true);
      try {
        const res = await api.get("/departments/cse/sections");
        if (res.data.ok) {
          setTitles(res.data.data.map((s) => ({ id: s.id, name: s.title })));
        }
      } catch (error) {
        console.error("Error loading sections:", error);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed to load sections",
        });
      } finally {
        setLoading(false);
      }
    };
    loadSections();
  }, []);

  // =============== LOAD DATA FOR SELECTED SECTION =============== //

  useEffect(() => {
    if (!activeTitle) return;

    const loadSectionData = async () => {
      setLoading(true);
      try {
        await fetchSubSectionsForSection(activeTitle.id);
        await loadContextData();
      } catch (error) {
        console.error("Error loading section data:", error);
        notifications.show({
          color: "red",
          title: "Error",
          message: "Failed to load section data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSectionData();
  }, [activeTitle, activeSubSection]);

  const loadContextData = async () => {
    const basePath = getBasePath();
    const contentUrl = getContentApiUrl();
    
    if (!basePath || !contentUrl) return;

    try {
      setLoadingContents(true);
      setLoadingSheets(true);

      const [peopleRes, pdfsRes, sheetsRes, contentsRes] = await Promise.allSettled([
        api.get(`${basePath}/people`).catch(() => ({ data: { ok: false, data: [] } })),
        api.get(`${basePath}/files`).catch(() => ({ data: { ok: false, data: [] } })),
        api.get(`${basePath}/excel-files`).catch(() => ({ data: { ok: false, data: [] } })),
        api.get(contentUrl).catch(() => ({ data: { ok: false, data: [] } }))
      ]);

      // Handle people
      if (peopleRes.status === 'fulfilled' && peopleRes.value.data.ok) {
        setPeople(peopleRes.value.data.data);
      } else {
        setPeople([]);
      }

      // Handle PDFs
      if (pdfsRes.status === 'fulfilled' && pdfsRes.value.data.ok) {
        setPdfs(pdfsRes.value.data.data);
      } else {
        setPdfs([]);
      }

      // Handle Excel sheets
      if (sheetsRes.status === 'fulfilled' && sheetsRes.value.data.ok) {
        setSheets(sheetsRes.value.data.data);
      } else {
        setSheets([]);
      }

      // Handle contents
      if (contentsRes.status === 'fulfilled' && contentsRes.value.data.ok) {
        setContents(contentsRes.value.data.data);
      } else {
        setContents([]);
      }

    } catch (error) {
      console.error("Error loading context data:", error);
      notifications.show({
        color: "orange",
        title: "Warning",
        message: "Some data failed to load",
      });
      setPeople([]);
      setPdfs([]);
      setSheets([]);
      setContents([]);
    } finally {
      setLoadingContents(false);
      setLoadingSheets(false);
    }
  };

  // =============== SECTION CRUD =============== //

  const handleAddTitle = async () => {
    if (!title.trim()) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Enter a section title",
      });
    }

    try {
      const res = await api.post(`/departments/cse/sections`, { title });

      const newSection = { id: res.data.data.id, name: res.data.data.title };
      setTitles((prev) => [...prev, newSection]);
      setActiveTitle(newSection);
      setActiveSubSection(null);
      setTitle("");

      setSubSectionsMap((prev) => ({ ...prev, [newSection.id]: [] }));

      notifications.show({
        color: "green",
        title: "Success",
        message: "Section added successfully",
      });
    } catch (error) {
      console.error("Error adding section:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "Failed to add section",
      });
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
      await api.delete(`/departments/cse/sections/${sectionId}`);
      
      setTitles((prev) => prev.filter((t) => t.id !== sectionId));
      
      setSubSectionsMap((prev) => {
        const copy = { ...prev };
        delete copy[sectionId];
        return copy;
      });

      if (activeTitle?.id === sectionId) {
        setActiveTitle(null);
        setActiveSubSection(null);
        setPeople([]);
        setPdfs([]);
        setSheets([]);
        setContents([]);
      }

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Section removed successfully",
      });
    } catch (error) {
      console.error("Error deleting section:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete section",
      });
    }
  };

  // =============== SUBSECTION CRUD =============== //

  const fetchSubSectionsForSection = async (sectionId) => {
    try {
      const res = await api.get(`/departments/cse/sections/${sectionId}/all/subsections`);
      if (res.data?.ok) {
        setSubSectionsMap((prev) => ({
          ...prev,
          [sectionId]: res.data.data,
        }));
      }
    } catch (err) {
      console.warn("No subsections found for section", sectionId);
      setSubSectionsMap((prev) => ({
        ...prev,
        [sectionId]: [],
      }));
    }
  };

  const handleSaveSubtopic = async () => {
    if (!subtopicTitle || !subtopicParent) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Please enter subtopic title",
      });
    }

    try {
      const res = await api.post(
        `/departments/cse/sections/${subtopicParent.id}/subsections`,
        { 
          title: subtopicTitle,
          description: subtopicDescription || null 
        }
      );

      const newSub = res.data.data;

      setSubSectionsMap((prev) => {
        const existing = prev[subtopicParent.id] || [];
        return {
          ...prev,
          [subtopicParent.id]: [...existing, newSub],
        };
      });

      notifications.show({
        color: "green",
        title: "Success",
        message: `Subtopic "${newSub.title}" added`,
      });

      setSubtopicTitle("");
      setSubtopicDescription("");
      setSubtopicParent(null);
      setOpenSubtopicModal(false);
    } catch (error) {
      console.error("Error adding subtopic:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "Failed to add subtopic",
      });
    }
  };

  const handleDeleteSubSection = async (sectionId, subSectionId) => {
    if (!window.confirm("Are you sure you want to delete this subtopic?")) return;

    try {
      await api.delete(
        `/departments/cse/sections/${sectionId}/subsections/${subSectionId}`
      );

      setSubSectionsMap((prev) => {
        const list = prev[sectionId] || [];
        return {
          ...prev,
          [sectionId]: list.filter((s) => s.id !== subSectionId),
        };
      });

      if (activeSubSection?.id === subSectionId) {
        setActiveSubSection(null);
        setContents([]);
      }

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Subtopic deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subtopic:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete subtopic",
      });
    }
  };

  // =============== FACULTY CRUD =============== //

  const handleSaveFaculty = async () => {
    if (!facultyName || !facultyDesignation || !activeTitle) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Please fill all required fields",
      });
    }

    const basePath = getBasePath();
    if (!basePath) return;

    const formData = new FormData();
    formData.append("name", facultyName);
    formData.append("designation", facultyDesignation);
    formData.append("about", facultyAbout || "");
    if (facultyPhoto) formData.append("photo", facultyPhoto);

    try {
      let response;
      if (editFaculty) {
        response = await api.put(`${basePath}/people/${editFaculty.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPeople((prev) =>
          prev.map((p) => (p.id === editFaculty.id ? response.data.data : p))
        );
      } else {
        response = await api.post(`${basePath}/people`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPeople((prev) => [...prev, response.data.data]);
      }

      setFacultyName("");
      setFacultyDesignation("");
      setFacultyAbout("");
      setFacultyPhoto(null);
      setEditFaculty(null);
      setOpenFacultyModal(false);

      notifications.show({
        color: "green",
        title: "Success",
        message: editFaculty
          ? "Faculty updated successfully"
          : "Faculty added successfully",
      });
    } catch (error) {
      console.error("Error saving faculty:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "Failed to save faculty",
      });
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) return;

    const basePath = getBasePath();
    if (!basePath) return;

    try {
      await api.delete(`${basePath}/people/${id}`);
      setPeople((prev) => prev.filter((p) => p.id !== id));

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Faculty member removed successfully",
      });
    } catch (error) {
      console.error("Error deleting faculty:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete faculty member",
      });
    }
  };

  // =============== PDF CRUD =============== //

  const handleSavePDF = async () => {
    if (!pdfTitle || !activeTitle) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Please enter PDF title",
      });
    }

    const basePath = getBasePath();
    if (!basePath) return;

    const formData = new FormData();
    formData.append("title", pdfTitle);
    if (pdfFile) formData.append("file", pdfFile);

    try {
      let response;
      if (editPDF) {
        response = await api.put(`${basePath}/files/${editPDF.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPdfs((prev) =>
          prev.map((p) => (p.id === editPDF.id ? response.data.data : p))
        );
      } else {
        response = await api.post(`${basePath}/files`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPdfs((prev) => [response.data.data, ...prev]);
      }

      setPdfTitle("");
      setPdfFile(null);
      setEditPDF(null);
      setOpenPDFModal(false);

      notifications.show({
        color: "green",
        title: "Success",
        message: editPDF
          ? "PDF updated successfully"
          : "PDF uploaded successfully",
      });
    } catch (error) {
      console.error("Error saving PDF:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "Failed to upload PDF",
      });
    }
  };

  const handleDeletePDF = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;

    const basePath = getBasePath();
    if (!basePath) return;

    try {
      await api.delete(`${basePath}/files/${id}`);
      setPdfs((prev) => prev.filter((p) => p.id !== id));

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "PDF removed successfully",
      });
    } catch (error) {
      console.error("Error deleting PDF:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete PDF",
      });
    }
  };

  // =============== EXCEL SHEET CRUD =============== //

  const handleSaveSheet = async () => {
    if (!sheetTitle || !sheetFile || !activeTitle) {
      return notifications.show({
        color: "red",
        title: "Required",
        message: "Please fill all fields",
      });
    }

    const basePath = getBasePath();
    if (!basePath) return;

    const formData = new FormData();
    formData.append("sheetName", sheetTitle);
    formData.append("file", sheetFile);

    try {
      await api.post(`${basePath}/excel-files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      notifications.show({
        color: "green",
        title: "Success",
        message: "Excel sheet uploaded successfully",
      });

      setSheetTitle("");
      setSheetFile(null);
      setOpenSheetModal(false);

      await loadContextData();
    } catch (error) {
      console.error("Error uploading sheet:", error);
      notifications.show({
        color: "red",
        title: "Upload Failed",
        message: error.response?.data?.message || "Failed to upload Excel sheet",
      });
    }
  };

  const handleDeleteSheet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Excel sheet?")) return;

    const basePath = getBasePath();
    if (!basePath) return;

    try {
      await api.delete(`${basePath}/excel-files/${id}`);
      setSheets((prev) => prev.filter((s) => s.id !== id));

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Excel sheet removed successfully",
      });
    } catch (error) {
      console.error("Error deleting sheet:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete Excel sheet",
      });
    }
  };

  // =============== CONTENT CRUD =============== //

  const handleSaveContent = async () => {
    if ((!contentText || contentText.trim() === '') && !contentPhoto) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Please enter content or upload a photo",
      });
    }

    if (!activeTitle) {
      return notifications.show({
        color: "yellow",
        title: "Required",
        message: "Please select a section first",
      });
    }

    const contentUrl = getContentApiUrl();
    if (!contentUrl) return;

    const formData = new FormData();
    formData.append("content", contentText || "");
    if (contentPhoto) formData.append("photo", contentPhoto);

    try {
      let response;
      if (contentId) {
        response = await api.put(`${contentUrl}/${contentId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setContents((prev) =>
          prev.map((c) => (c.id === contentId ? response.data.data : c))
        );

        notifications.show({
          color: "green",
          title: "Success",
          message: "Content updated successfully",
        });
      } else {
        response = await api.post(contentUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setContents((prev) => [response.data.data, ...prev]);

        notifications.show({
          color: "green",
          title: "Success",
          message: "Content added successfully",
        });
      }

      setContentId(null);
      setContentText("");
      setContentPhoto(null);
      setOpenContentModal(false);
    } catch (error) {
      console.error("Error saving content:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: error.response?.data?.message || "Failed to save content",
      });
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;

    const contentUrl = getContentApiUrl();
    if (!contentUrl) return;

    try {
      await api.delete(`${contentUrl}/${id}`);
      setContents((prev) => prev.filter((c) => c.id !== id));

      notifications.show({
        color: "green",
        title: "Deleted",
        message: "Content removed successfully",
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Cannot delete content",
      });
    }
  };

  // =============== PREVIEW FUNCTIONS =============== //

  const handleOpenSheetPreview = async (sheet) => {
    if (!sheet.id) {
      return notifications.show({
        color: "red",
        title: "Invalid File",
        message: "This Excel file cannot be previewed",
      });
    }

    const basePath = getBasePath();
    if (!basePath) return;

    setLoadingSheetPreview(true);
    setSheetPreviewData(null);
    setOpenSheetPreview(true);

    try {
      const response = await api.get(`${basePath}/excel-files/${sheet.id}`);

      if (response.data?.ok) {
        setSheetPreviewData({
          file: response.data.file,
          rows: response.data.rows || [],
          downloadUrl: response.data.downloadUrl || `${BASE_URL}/uploads/excel/${sheet.filename}`,
        });
      } else {
        throw new Error("Preview not available");
      }
    } catch (error) {
      console.error("Error loading sheet preview:", error);
      setSheetPreviewData({
        file: sheet,
        rows: [],
        downloadUrl: `${BASE_URL}/uploads/excel/${sheet.filename}`,
        message: "Preview not available. Download the file to view it.",
      });
    } finally {
      setLoadingSheetPreview(false);
    }
  };

  const handleOpenPDFPreview = (pdf) => {
    let pdfUrl = pdf.path;
    if (!pdf.path.startsWith("http")) {
      pdfUrl = pdf.path.startsWith("/")
        ? `${BASE_URL}${pdf.path}`
        : `${BASE_URL}/${pdf.path}`;
    }
    setPdfPreviewUrl(pdfUrl);
    setOpenPDFPreview(true);
  };

  const handleDownloadPDF = (pdf) => {
    let downloadUrl = pdf.path;
    if (!pdf.path.startsWith("http")) {
      downloadUrl = pdf.path.startsWith("/")
        ? `${BASE_URL}${pdf.path}`
        : `${BASE_URL}/${pdf.path}`;
    }
    window.open(downloadUrl, "_blank");
  };

  // =============== UTILITY FUNCTIONS =============== //

  const readableSize = (size) => {
    if (!size) return "—";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB"];
    return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

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
                <Table.Th
                  key={index}
                  style={{ backgroundColor: "#faf3f3", color: maroon }}
                >
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

  const testExcelAPI = async () => {
    if (!activeTitle) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Please select a section first",
      });
      return;
    }

    const basePath = getBasePath();
    if (!basePath) return;

    try {
      const response = await api.get(`${basePath}/excel-files`);
      
      if (response.data.ok && Array.isArray(response.data.data)) {
        setSheets(response.data.data);
        notifications.show({
          color: "green",
          title: "API Test",
          message: `Found ${response.data.data.length} Excel sheets`,
        });
      } else {
        notifications.show({
          color: "orange",
          title: "API Test",
          message: "Unexpected response format",
        });
      }
    } catch (error) {
      console.error("API Test Error:", error);
      notifications.show({
        color: "red",
        title: "API Test Failed",
        message: "Could not connect to Excel API",
      });
    }
  };

  // =============== RENDER =============== //

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
        </Stack>
      </Modal>

      {/* SHEET PREVIEW MODAL */}
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
            <Group justify="center" py="xl">
              <Loader size="md" color={maroon} />
              <Text>Loading sheet data…</Text>
            </Group>
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
          setFacultyAbout("");
          setFacultyPhoto(null);
        }}
        title={editFaculty ? "Edit Faculty" : "Add Faculty"}
        centered
        size="lg"
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

          <Textarea
            label="About"
            value={facultyAbout}
            onChange={(e) => setFacultyAbout(e.target.value)}
            placeholder="Enter detailed description, profile, or about information"
            minRows={4}
            autosize
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
        {previewUrl && (
          <Image
            src={previewUrl}
            fit="contain"
            radius="md"
            style={{ width: "100%", maxHeight: "80vh" }}
          />
        )}
      </Modal>

      {/* ABOUT MODAL */}
      <Modal
        opened={openAboutModal}
        onClose={() => setOpenAboutModal(false)}
        centered
        size="md"
        title="Faculty Details"
      >
        <Stack>
          <Textarea
            value={selectedFacultyAbout}
            readOnly
            minRows={6}
            autosize
            styles={{
              input: {
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
              },
            }}
          />
          <Group justify="right">
            <Button
              color={maroon}
              onClick={() => setOpenAboutModal(false)}
            >
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* SUBTOPIC MODAL */}
      <Modal
        opened={openSubtopicModal}
        onClose={() => {
          setOpenSubtopicModal(false);
          setSubtopicParent(null);
          setSubtopicTitle("");
          setSubtopicDescription("");
        }}
        centered
        title={
          subtopicParent
            ? `Add Subtopic - ${subtopicParent.name}`
            : "Add Subtopic"
        }
        size="lg"
      >
        <Stack>
          <TextInput
            label="Subtopic Title"
            placeholder="Enter subtopic title"
            value={subtopicTitle}
            onChange={(e) => setSubtopicTitle(e.target.value)}
            required
          />
          
          <Textarea
            label="Description (Optional)"
            placeholder="Enter subtopic description"
            value={subtopicDescription}
            onChange={(e) => setSubtopicDescription(e.target.value)}
            minRows={3}
            autosize
          />
          
          <Button color={maroon} onClick={handleSaveSubtopic}>
            Add Subtopic
          </Button>
        </Stack>
      </Modal>

      {/* SUBTOPIC DETAILS MODAL */}
      <Modal
        opened={openSubtopicDetailsModal}
        onClose={() => {
          setOpenSubtopicDetailsModal(false);
          setSelectedSubtopic(null);
        }}
        centered
        title="Subtopic Details"
        size="md"
      >
        {selectedSubtopic && (
          <Stack>
            <Text fw={600} size="lg" c={maroon}>
              {selectedSubtopic.title}
            </Text>
            {selectedSubtopic.description ? (
              <Textarea
                value={selectedSubtopic.description}
                readOnly
                minRows={5}
                autosize
                styles={{
                  input: {
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                  },
                }}
              />
            ) : (
              <Text c="dimmed" fs="italic">
                No description provided
              </Text>
            )}
            <Group justify="right">
              <Button
                color={maroon}
                onClick={() => setOpenSubtopicDetailsModal(false)}
              >
                Close
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* SIMPLE CONTENT MODAL - FIXED VERSION */}
      <Modal
        opened={openContentModal}
        onClose={() => {
          setOpenContentModal(false);
          setContentId(null);
          setContentText("");
          setContentPhoto(null);
        }}
        centered
        title={contentId ? "Edit Content" : "Add Content"}
        size="xl"
      >
        <Stack>
          <Textarea
            label="Content"
            placeholder="Enter your content here. "
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            minRows={10}
            autosize
          />

          <FileInput
            label="Upload Photo (Optional)"
            accept="image/*"
            onChange={setContentPhoto}
            placeholder="Choose photo file"
            leftSection={<IconPhoto size={16} />}
          />

          <Group justify="right" mt="md">
            <Button
              variant="outline"
              color="gray"
              onClick={() => {
                setOpenContentModal(false);
                setContentId(null);
                setContentText("");
                setContentPhoto(null);
              }}
            >
              Cancel
            </Button>
            <Button color={maroon} onClick={handleSaveContent}>
              {contentId ? "Update Content" : "Save Content"}
            </Button>
          </Group>
        </Stack>
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
                  Computer Science and Engineering
                </Title>
              </Group>
            </Group>

            <Button
              variant="light"
              color="orange"
              size="sm"
              onClick={testExcelAPI}
              leftSection={<IconEye size={16} />}
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
            height: "calc(100vh - 60px)",
            marginTop: 60,
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
                    "&:hover": {
                      background: `linear-gradient(90deg, ${darkRed}, ${maroon})`,
                    },
                  },
                }}
              >
                Add Section
              </Button>

              <Divider color={maroon} my="sm" />

              <Text fw={600} c={maroon} size="sm">
                Sections:
              </Text>

              {loading ? (
                <Group justify="center" py="xl">
                  <Loader size="sm" color={maroon} />
                  <Text size="sm">Loading sections...</Text>
                </Group>
              ) : titles.length === 0 ? (
                <Text c="dimmed" size="sm" ta="center" py="md">
                  No sections added yet
                </Text>
              ) : (
                titles.map((t) => (
                  <Card
                    key={t.id}
                    p="sm"
                    withBorder
                    onClick={() => {
                      setActiveTitle(t);
                      setActiveSubSection(null);
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        activeTitle?.id === t.id && !activeSubSection
                          ? "#ffecec"
                          : "white",
                      border:
                        activeTitle?.id === t.id && !activeSubSection
                          ? `2px solid ${maroon}`
                          : "1px solid #ccc",
                      transition: "all 0.2s",
                    }}
                  >
                    <Group justify="space-between">
                      <Text fw={700} c={maroon} size="sm">
                        {t.name}
                      </Text>

                      <Group gap="xs">
                        <ActionIcon
                          color="green"
                          variant="light"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubtopicParent(t);
                            setSubtopicTitle("");
                            setSubtopicDescription("");
                            setOpenSubtopicModal(true);
                          }}
                          title="Add Subtopic"
                        >
                          <IconPlus size={14} />
                        </ActionIcon>

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
                    </Group>

                    {/* SUBSECTIONS */}
                    {subSectionsMap[t.id] &&
                      subSectionsMap[t.id].length > 0 && (
                        <Stack gap={4} mt={8} pl="md">
                          {subSectionsMap[t.id].map((sub) => {
                            const isActive =
                              activeTitle?.id === t.id &&
                              activeSubSection?.id === sub.id;
                            const hasDescription = sub.description && sub.description.trim().length > 0;
                            
                            return (
                              <Group
                                key={sub.id}
                                justify="space-between"
                                style={{
                                  borderLeft: isActive
                                    ? `2px solid ${maroon}`
                                    : "2px solid transparent",
                                  paddingLeft: 6,
                                }}
                              >
                                <Group gap="xs">
                                  <Text
                                    size="xs"
                                    c={isActive ? maroon : "dimmed"}
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTitle(t);
                                      setActiveSubSection(sub);
                                    }}
                                  >
                                    {sub.title}
                                  </Text>
                                  {hasDescription && (
                                    <ActionIcon
                                      size="xs"
                                      color="blue"
                                      variant="subtle"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSubtopic(sub);
                                        setOpenSubtopicDetailsModal(true);
                                      }}
                                      title="View Description"
                                    >
                                      <IconNote size={10} />
                                    </ActionIcon>
                                  )}
                                </Group>
                                <ActionIcon
                                  size="xs"
                                  color="red"
                                  variant="subtle"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSubSection(t.id, sub.id);
                                  }}
                                >
                                  <IconTrash size={12} />
                                </ActionIcon>
                              </Group>
                            );
                          })}
                        </Stack>
                      )}
                  </Card>
                ))
              )}
            </Stack>
          </ScrollArea>
        </AppShell.Navbar>

        {/* MAIN CONTENT */}
        <AppShell.Main style={{ paddingTop: 80, backgroundColor: "#fffafa" }}>
          {loading ? (
            <Group justify="center" h="50vh">
              <Loader size="xl" color={maroon} />
              <Text size="lg" c={maroon}>
                Loading department data...
              </Text>
            </Group>
          ) : activeTitle ? (
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
                {activeSubSection && (
                  <>
                    <Text
                      component="span"
                      size="sm"
                      c="dimmed"
                      ml="xs"
                    >{` / ${activeSubSection.title}`}</Text>
                    {activeSubSection.description && (
                      <Badge
                        size="xs"
                        color="blue"
                        variant="light"
                        ml="xs"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedSubtopic(activeSubSection);
                          setOpenSubtopicDetailsModal(true);
                        }}
                        title="View description"
                      >
                        <IconNote size={10} style={{ marginRight: 4 }} />
                        Info
                      </Badge>
                    )}
                  </>
                )}
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

                <Button
                  color={maroon}
                  leftSection={<IconTextSize size={18} />}
                  onClick={() => {
                    setContentId(null);
                    setContentText("");
                    setContentPhoto(null);
                    setOpenContentModal(true);
                  }}
                  size="md"
                >
                  Add Photo
                </Button>

                {/* <Button
                  color="orange"
                  variant="outline"
                  leftSection={<IconEye size={18} />}
                  onClick={testExcelAPI}
                  size="md"
                >
                  Debug Sheets
                </Button> */}
              </Group>

              {/* CONTENTS SECTION */}
              <Title order={3} c={maroon} mb="md">
                Photos ({loadingContents ? "Loading..." : contents.length})
              </Title>

              {loadingContents ? (
                <Card
                  p="xl"
                  withBorder
                  style={{ textAlign: "center", backgroundColor: "#f9f9f9" }}
                >
                  <Group justify="center">
                    <Loader size="sm" color={maroon} />
                    <Text c="blue">Loading contents...</Text>
                  </Group>
                </Card>
              ) : contents.length > 0 ? (
                <Grid gutter="md" mb="xl">
                  {contents.map((content) => {
                    const hasPhoto = content.photo && content.photo.trim().length > 0;
                    const photoUrl = hasPhoto ? `${BASE_URL}/uploads/photos/${content.photo}` : null;
                    
                    return (
                      <Grid.Col key={content.id} span={{ base: 12, sm: 6, md: 6 }}>
                        <Card withBorder shadow="sm" p="md">
                          <Group align="flex-start" wrap="nowrap">
                            {hasPhoto && (
                              <Box style={{ flexShrink: 0 }}>
                                <Image
                                  src={photoUrl}
                                  width={120}
                                  height={120}
                                  radius="md"
                                  fit="cover"
                                  onClick={() => {
                                    setPreviewUrl(photoUrl);
                                    setOpenPreview(true);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  alt="Content"
                                />
                              </Box>
                            )}
                            <Box style={{ flex: 1 }}>
                              <div style={{ fontSize: '14px' }}>
                                {renderContent(content.content)}
                              </div>
                              <Group justify="right" mt="sm">
                                <ActionIcon
                                  color="blue"
                                  variant="light"
                                  onClick={() => {
                                    setContentId(content.id);
                                    setContentText(content.content);
                                    setOpenContentModal(true);
                                  }}
                                  title="Edit Content"
                                >
                                  <IconEdit size={16} />
                                </ActionIcon>
                                <ActionIcon
                                  color="red"
                                  variant="light"
                                  onClick={() => handleDeleteContent(content.id)}
                                  title="Delete Content"
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Group>
                            </Box>
                          </Group>
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              ) : (
                <Card
                  p="xl"
                  withBorder
                  style={{ textAlign: "center", backgroundColor: "#f9f9f9" }}
                >
                  <Text c="dimmed" size="lg">
                    No content added yet
                  </Text>
                  <Text size="sm" c="orange" mt="sm">
                    Use "Add Content" button to add text content with optional photo
                  </Text>
                </Card>
              )}

              <Divider my="xl" color={maroon} />

              {/* FACULTY SECTION */}
              <Title order={3} c={maroon} mb="md">
                Faculty Members ({people.length})
              </Title>

              {people.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt="md">
                  {people.map((f) => {
                    const img = f.photo
                      ? `${BASE_URL}${f.photo}`
                      : "/default-avatar.png";
                    const hasAbout = f.about && f.about.trim().length > 0;
                    
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

                        {hasAbout && (
                          <Group justify="center" mt="sm" mb="xs">
                            <Button
                              size="xs"
                              variant="light"
                              color="blue"
                              leftSection={<IconInfoCircle size={14} />}
                              onClick={() => {
                                setSelectedFacultyAbout(f.about);
                                setOpenAboutModal(true);
                              }}
                            >
                              View Details
                            </Button>
                          </Group>
                        )}

                        <Group justify="center" mt="sm">
                          <ActionIcon
                            color="blue"
                            variant="light"
                            onClick={() => {
                              setEditFaculty(f);
                              setFacultyName(f.name);
                              setFacultyDesignation(f.designation);
                              setFacultyAbout(f.about || "");
                              setOpenFacultyModal(true);
                            }}
                            title="Edit Faculty"
                          >
                            <IconEdit size={16} />
                          </ActionIcon>

                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => handleDeleteFaculty(f.id)}
                            title="Delete Faculty"
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

              {/* PDF SECTION */}
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
                            <Text fw={600} size="lg">
                              {pdf.title}
                            </Text>
                            <Text size="sm" c="dimmed">
                              Size: {readableSize(pdf.size)} • Added:{" "}
                              {new Date(pdf.createdAt).toLocaleDateString()}
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

              {/* EXCEL SHEETS SECTION */}
              <Title order={3} c={maroon} mb="md">
                Excel Sheets ({loadingSheets ? "Loading..." : sheets.length})
              </Title>

              {loadingSheets ? (
                <Card
                  p="xl"
                  withBorder
                  style={{ textAlign: "center", backgroundColor: "#f9f9f9" }}
                >
                  <Group justify="center">
                    <Loader size="sm" color={maroon} />
                    <Text c="blue">Loading Excel sheets...</Text>
                  </Group>
                </Card>
              ) : sheets.length > 0 ? (
                <Stack mt="sm" gap="md">
                  {sheets.map((sheet, index) => (
                    <Card
                      key={sheet.id || index}
                      p="md"
                      withBorder
                      shadow="sm"
                    >
                      <Group justify="space-between" align="center">
                        <Group>
                          <IconFile size={24} color={maroon} />
                          <div>
                            <Text fw={600} size="lg">
                              {sheet.originalName ||
                                sheet.sheetName ||
                                sheet.filename ||
                                `Sheet ${index + 1}`}
                            </Text>
                            <Text size="sm" c="dimmed">
                              ID: {sheet.id} • Size:{" "}
                              {readableSize(sheet.size)} • Added:{" "}
                              {sheet.createdAt
                                ? new Date(
                                    sheet.createdAt
                                  ).toLocaleDateString()
                                : "Unknown"}
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
                  ))}
                </Stack>
              ) : (
                <Card
                  p="xl"
                  withBorder
                  style={{ textAlign: "center", backgroundColor: "#f9f9f9" }}
                >
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
                Welcome to CSE Department
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
};

export default CSE;