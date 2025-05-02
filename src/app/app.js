const Sidebar = () => {
  const [expanded, setExpanded] = useState({
    data: true,
    pages: true,
    charts: true
  });
  
  // Add state to track sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };