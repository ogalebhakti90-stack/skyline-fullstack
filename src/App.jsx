import { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const initialEmployees = [
  { id: "ST-2001", name: "Harshit Pandey", role: "Chief Executive Officer & Project Director", age: 19, gender: "Male", contact: "+91 98201 12345", address: "Bandra Kurla Complex, Mumbai, MH", wage: 3500, otHours: 5.0, overtime: 3281, paid: true, status: "Active", floor: 32 },
  { id: "ST-2002", name: "Col. Rajeshwar Rao", role: "Senior Project Management Consultant (PMC)", age: 52, gender: "Male", contact: "+91 98111 23456", address: "Juhu Scheme, Mumbai, MH", wage: 2400, otHours: 2.0, overtime: 900, paid: true, status: "Active", floor: 28 },
  { id: "ST-2003", name: "Ar. Sneha Deshmukh", role: "Principal Lead Architect (Facade & Interiors)", age: 38, gender: "Female", contact: "+91 97234 34567", address: "Pali Hill, Bandra West, Mumbai, MH", wage: 2200, otHours: 1.5, overtime: 618, paid: false, status: "Active", floor: 24 },
  { id: "ST-2004", name: "Er. Vikramaditya Sen", role: "Chief Structural & Geotechnical Engineer", age: 45, gender: "Male", contact: "+91 94140 45678", address: "Lower Parel, Mumbai, MH", wage: 2000, otHours: 3.0, overtime: 1125, paid: true, status: "Active", floor: 22 },
  { id: "ST-2005", name: "Capt. Alok Nambiar", role: "Head of EHS & Site Safety Operations", age: 44, gender: "Male", contact: "+91 93345 56789", address: "Thane West, Maharashtra", wage: 1600, otHours: 2.0, overtime: 600, paid: true, status: "Active", floor: 15 },
  { id: "ST-2006", name: "Manoj Tiwari", role: "Liebherr High-Mast Tower Crane Operator", age: 38, gender: "Male", contact: "+91 95400 67890", address: "Sector 62, Noida, UP", wage: 950, otHours: 4.0, overtime: 712, paid: false, status: "Active", floor: 31 },
  { id: "ST-2007", name: "Pooja Patel", role: "Senior QA/QC NDT Laboratory Lead", age: 27, gender: "Female", contact: "+91 97234 89012", address: "Navrangpura, Ahmedabad, GJ", wage: 1250, otHours: 3.5, overtime: 820, paid: true, status: "Active", floor: 20 },
  { id: "ST-2008", name: "Rameshwar Prasad", role: "Master Rebar Fabricator & Bar Bender Lead", age: 41, gender: "Male", contact: "+91 98220 90123", address: "Kurla West, Mumbai, MH", wage: 950, otHours: 3.0, overtime: 534, paid: true, status: "Active", floor: 24 },
  { id: "ST-2009", name: "Kavita Reddy", role: "HV Substation & MEP Services Specialist", age: 28, gender: "Female", contact: "+91 98480 01234", address: "Madhapur, Hyderabad, TS", wage: 1150, otHours: 2.5, overtime: 646, paid: true, status: "Active", floor: 6 },
  { id: "ST-2010", name: "Suresh Kamble", role: "RMC Batching & Pumping Master Foreman", age: 46, gender: "Male", contact: "+91 98200 44556", address: "Ghatkopar East, Mumbai, MH", wage: 900, otHours: 4.0, overtime: 675, paid: false, status: "Active", floor: 24 }
];

const initialMaterials = [
  { id: 1, name: "Ready-Mix Concrete (M35 Grade Structural Pumpable)", unit: "Cu. M", threshold: 120, brought: 1450, used: 1290, needed: 450, rate: 4850 },
  { id: 2, name: "Fe 550D TMT High-Yield Reinforcement Steel Bars", unit: "Tonnes", threshold: 35, brought: 160, used: 138, needed: 60, rate: 64500 },
  { id: 3, name: "OPC 53 Grade High-Strength Rapid-Setting Cement", unit: "Bags", threshold: 300, brought: 3200, used: 2850, needed: 1000, rate: 385 },
  { id: 4, name: "Saint-Gobain 12mm Toughened Glass Facade Panels", unit: "Sq. M", threshold: 600, brought: 14000, used: 12200, needed: 1800, rate: 3200 },
  { id: 5, name: "Structural Anodized Aluminum Curtain Wall Framing", unit: "Meters", threshold: 500, brought: 9200, used: 8100, needed: 1100, rate: 1450 },
  { id: 6, name: "Autoclaved Aerated Concrete (AAC) Partition Blocks", unit: "Units", threshold: 3000, brought: 32000, used: 28500, needed: 7000, rate: 24 }
];

const initialExpenses = [
  { id: "VCH-2026-081", description: "Heavy Generator High-Speed Diesel Draw (500L Bulk)", category: "Auxiliary Power", amount: 48500, date: "2026-09-08", authorizedBy: "Harshit Pandey (CEO)", status: "Audited" },
  { id: "VCH-2026-082", description: "Municipal & Tanker Bulk Curing Hydration Logistics", category: "Site Utilities", amount: 18400, date: "2026-09-07", authorizedBy: "Col. Rajeshwar Rao (PMC)", status: "Audited" },
  { id: "VCH-2026-083", description: "BOMAG Heavy Tandem Roller 12hr Shift Deployment", category: "Plant Machinery", amount: 24000, date: "2026-09-06", authorizedBy: "Harshit Pandey (CEO)", status: "Pending" },
  { id: "VCH-2026-084", description: "VJTI Laboratory 28-Day Concrete Core Compression Test", category: "Quality & Testing", amount: 12500, date: "2026-09-05", authorizedBy: "Pooja Patel (QC Lead)", status: "Audited" }
];

const initialPOs = [
  { id: "PO-BKC-7801", vendor: "UltraTech Ready-Mix Concrete Division", item: "Ready-Mix Concrete (M35 Grade)", qty: 200, unit: "Cu. M", unitRate: 4850, status: "Authorized", date: "2026-09-05" },
  { id: "PO-BKC-7802", vendor: "Tata Steel BSL Commercial Hub", item: "Fe 550D TMT Reinforcement Steel Bars", qty: 40, unit: "Tonnes", unitRate: 64500, status: "Authorized", date: "2026-09-07" },
  { id: "PO-BKC-7803", vendor: "Saint-Gobain Glass India Ltd", item: "Saint-Gobain 12mm Toughened Glass Facade Panels", qty: 1500, unit: "Sq. M", unitRate: 3200, status: "Review", date: "2026-09-08" }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState(initialEmployees);
  const [materials, setMaterials] = useState(initialMaterials);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [purchaseOrders, setPurchaseOrders] = useState(initialPOs);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('FY 2026-27');
  const [activeFloorInspect, setActiveFloorInspect] = useState(24);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState(null);

  // Authentication States - Forced default logout
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true); 
  const [loginTab, setLoginTab] = useState('staff');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // 3D Orbit Physics State
  const canvasRef = useRef(null);
  const rotationAngleRef = useRef(0.45);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    role: '',
    empAge: '',
    empGender: 'Male',
    empContact: '',
    empWage: '',
    empOtHours: '0',
    empAddress: ''
  });

  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Auxiliary Power',
    amount: '',
    authorizedBy: 'Harshit Pandey'
  });

  const [newPO, setNewPO] = useState({
    vendor: '',
    item: 'Ready-Mix Concrete (M35 Grade Structural Pumpable)',
    qty: '',
    unit: 'Cu. M',
    unitRate: '4850'
  });

  // --- NEW: FETCH EMPLOYEES FROM SPRING BOOT ON LOAD ---
  useEffect(() => {
    fetch('http://localhost:8080/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Map backend data to safely merge with your frontend UI requirements
          const formattedData = data.map(emp => ({
            id: emp.id,
            name: emp.name,
            role: "General Tradesperson", // Fallback for UI
            age: emp.age,
            gender: emp.gender,
            contact: emp.contact,
            address: emp.address,
            wage: emp.wage,
            otHours: emp.otHours,
            overtime: Math.round(emp.otHours * (emp.wage / 8) * 1.5),
            paid: false,
            status: emp.active ? "Active" : "Inactive",
            floor: 24
          }));
          setEmployees(formattedData);
        }
      })
      .catch(err => console.error("Database connection failed, using local dummy data."));
  }, []);
  // -----------------------------------------------------

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    triggerToast(`Theme switched to ${theme === 'light' ? 'Obsidian Dark' : 'Technical Light'}`);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
        setSelectedPayslipEmp(null);
        setNotificationsOpen(false);
        // Only allow closing the login modal via ESC if the user is already authenticated
        if (user) {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  // -------------------------------------------------------------
  // 32-FLOOR PROCEDURAL 3D BIM ISOMETRIC ORBIT ENGINE
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMouseXRef.current = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastMouseXRef.current;
      rotationAngleRef.current += deltaX * 0.007;
      lastMouseXRef.current = e.clientX;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 55;
      
      if (!isDraggingRef.current) {
        rotationAngleRef.current += 0.0025;
      }
      const angle = rotationAngleRef.current;

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      for (let g = -6; g <= 6; g++) {
        ctx.beginPath();
        ctx.moveTo(cx + g * 32 - Math.cos(angle) * 70, cy + 115 + g * 8);
        ctx.lineTo(cx + g * 32 + Math.cos(angle) * 70, cy + 145 - g * 8);
        ctx.stroke();
      }

      const totalSlabs = 32;
      for (let s = 1; s <= totalSlabs; s++) {
        const slabY = cy + 100 - s * 6.2;
        const radiusX = s <= 5 ? 95 : (105 - s * 0.4);
        const radiusY = s <= 5 ? 42 : (45 - s * 0.2);
        const skewX = Math.sin(angle) * 16;
        const skewY = Math.cos(angle) * 6;

        ctx.beginPath();
        ctx.moveTo(cx - radiusX + skewX, slabY);
        ctx.lineTo(cx + skewX, slabY - radiusY + skewY);
        ctx.lineTo(cx + radiusX + skewX, slabY);
        ctx.lineTo(cx + skewX, slabY + radiusY + skewY);
        ctx.closePath();

        if (s <= 24) {
          ctx.fillStyle = 'rgba(37, 99, 235, 0.16)';
          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = 1;
        } else if (s === activeFloorInspect) {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.55)';
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 0.6;
        }
        ctx.fill();
        ctx.stroke();
      }

      const roofY = cy + 100 - totalSlabs * 6.2;
      const craneAnchorX = cx + Math.sin(angle) * 14;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(craneAnchorX, roofY);
      ctx.lineTo(craneAnchorX, roofY - 28);
      ctx.stroke();

      const jibAngle = angle * 2.2;
      ctx.beginPath();
      ctx.moveTo(craneAnchorX - Math.cos(jibAngle) * 16, roofY - 26);
      ctx.lineTo(craneAnchorX + Math.cos(jibAngle) * 45, roofY - 26);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeFloorInspect]);

  // Auth Submit Handler
  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim();
    if (!cleanUser || !passwordInput) {
      setLoginError('Please provide valid credentials.');
      return;
    }

    const assignedRole = loginTab === 'staff' ? 'Site Operative / Staff' : 'Management (Admin & Executive)';
    setUser({
      name: cleanUser,
      role: assignedRole,
      avatar: cleanUser.slice(0, 2).toUpperCase()
    });
    
    setIsModalOpen(false);
    setLoginError('');
    setUsernameInput('');
    setPasswordInput('');
    triggerToast(`Logged in successfully as ${cleanUser}`);
  };

  const togglePaidStatus = (id) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        const next = !emp.paid;
        triggerToast(`${emp.name}: Payout state changed`);
        return { ...emp, paid: next };
      }
      return emp;
    }));
  };

  const handleStatusChange = (id, newStatus) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        triggerToast(`${emp.name}: Status updated to ${newStatus}`);
        return { ...emp, status: newStatus };
      }
      return emp;
    }));
  };

  const updateOtHours = (id, delta) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        const nextHours = Math.max(0, parseFloat((emp.otHours + delta).toFixed(1)));
        const hourlyRate = (emp.wage / 8) * 1.5;
        const nextOtPay = Math.round(nextHours * hourlyRate);
        return { ...emp, otHours: nextHours, overtime: nextOtPay };
      }
      return emp;
    }));
  };

  const removeEmployee = (id, name) => {
    if (window.confirm(`Decommission operative ${name} (${id}) from active project ledger?`)) {
      setEmployees(employees.filter(emp => emp.id !== id));
      triggerToast(`Operative removed`);
    }
  };

  const updateMaterialField = (id, field, value) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setMaterials(materials.map(m => m.id === id ? { ...m, [field]: num } : m));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const entry = {
      id: `VCH-2026-0${Math.floor(85 + Math.random() * 50)}`,
      description: newExpense.description,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().slice(0, 10),
      authorizedBy: user ? user.name : 'System Generated',
      status: "Audited"
    };
    setExpenses([entry, ...expenses]);
    setNewExpense({ description: '', category: 'Auxiliary Power', amount: '', authorizedBy: '' });
    triggerToast(`Voucher ${entry.id} committed to journal`);
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    const po = {
      id: `PO-BKC-${Math.floor(7820 + Math.random() * 90)}`,
      vendor: newPO.vendor,
      item: newPO.item,
      qty: parseFloat(newPO.qty),
      unit: newPO.unit,
      unitRate: parseFloat(newPO.unitRate),
      status: "Authorized",
      date: new Date().toISOString().slice(0, 10)
    };
    setPurchaseOrders([po, ...purchaseOrders]);
    setNewPO({ vendor: '', item: 'Ready-Mix Concrete (M35 Grade Structural Pumpable)', qty: '', unit: 'Cu. M', unitRate: '4850' });
    triggerToast(`Purchase Order ${po.id} approved & dispatched`);
  };

  const handleExportCSV = () => {
    const headers = ["Personnel ID,Operative Name,Trade Assignment,Demographics,Mobile,Base Wage (INR),OT Hours,OT Pay (INR),Payment Status,Deployment"];
    const rows = employees.map(e => 
      `"${e.id}","${e.name}","${e.role}","${e.age}Y/${e.gender}","${e.contact}",${e.wage},${e.otHours},${e.overtime},"${e.paid ? 'Disbursed' : 'Pending'}","${e.status}"`
    );
    const blob = new Blob([[headers, ...rows].join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Skyline_Tower_Workforce_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast("Payroll export downloaded (CSV)");
  };

  const handleDownloadExecutiveBrief = () => {
    const brief = 
      `============================================================\n` +
      `APEX INFRASTRUCTURES PVT LTD - EXECUTIVE SITE BRIEF\n` +
      `PROJECT: SKYLINE COMMERCIAL TOWER (BKC PLOT C-44)\n` +
      `ISSUED BY: ${user ? user.name.toUpperCase() : 'SYSTEM'}\n` +
      `============================================================\n\n` +
      `Extraction Timestamp : ${new Date().toISOString()}\n` +
      `Fiscal Period        : ${selectedFiscalYear}\n` +
      `Total Height / Floors: 145m / 32 Floors (Ground + 31 Floors)\n` +
      `MahaRERA Ref         : P51800034512\n\n` +
      `[1] PROJECT SCHEDULE & ERECTION\n` +
      `- Structural Progress : 75.0% Completed (Podium + 24 Slabs Cast)\n` +
      `- Milestone In Focus  : Level 24 Tower Suite Deck (18 Days Remaining)\n` +
      `- Active Workforce    : ${employees.filter(e => e.status === 'Active').length} Operatives\n` +
      `- Total Inventory Val : ₹${(materials.reduce((a, b) => a + (b.brought * b.rate), 0) / 100000).toFixed(2)} Lakhs\n\n` +
      `[2] REGULATORY CLEARANCES\n` +
      `- Municipal Fire NOC  : Granted\n` +
      `- Structural Stability : VJTI Mumbai Certified\n` +
      `- Cryptographic Seal  : SHA256-8F92A014E21B77CD891E\n`;

    const blob = new Blob([brief], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Skyline_Tower_Executive_Audit.txt`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast("Executive Audit Brief downloaded");
  };

  const filteredEmployees = employees.filter(emp => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.contact.includes(q);

    if (statusFilter === 'ALL') return matchesQuery;
    if (statusFilter === 'UNPAID') return matchesQuery && !emp.paid;
    return matchesQuery && emp.status === statusFilter;
  });

  const lineData = {
    labels: ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26"],
    datasets: [
      {
        label: "Actual Outlay (₹ Lakhs)",
        data: [42, 98, 160, 245, 310, 385, 440, 482],
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#f97316"
      },
      {
        label: "Target Baseline (₹ Lakhs)",
        data: [50, 110, 180, 260, 330, 410, 470, 520],
        borderColor: "#3b82f6",
        borderDash: [5, 5],
        tension: 0.35,
        borderWidth: 1.5,
        pointRadius: 0
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ₹ ${ctx.raw} Lakhs` } }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: (v) => "₹ " + v + " L" } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: '#f1f5f9',
          boxWidth: 8,
          font: { size: 10, weight: "700", family: 'Plus Jakarta Sans' }
        }
      }
    }
  };

  const planData = {
    labels: ["Completed (Podium + 24 Slabs)", "Active Pour (L25)", "Remaining Scope"],
    datasets: [{
      data: [75, 8, 17],
      backgroundColor: ["#f97316", "#3b82f6", "#1e293b"],
      borderColor: "#080c14",
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const materialDonutData = {
    labels: materials.map(m => m.name.split(' ')[0]),
    datasets: [{
      data: materials.map(m => Math.round(m.brought * m.rate / 100000)),
      backgroundColor: ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#facc15", "#ec4899"],
      borderColor: "#080c14",
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      case 'Suspended': return 'status-suspended';
      case 'Holiday': return 'status-holiday';
      case 'Absent': return 'status-absent';
      case 'Terminated': return 'status-terminated';
      default: return 'status-inactive';
    }
  };

  return (
    <div className="app-wrapper" data-theme={theme}>
      {toastMessage && (
        <div className="toast-banner">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP INDUSTRIAL TELEMETRY STRIP */}
      <div className="top-telemetry-ticker">
        <div className="ticker-item"><span className="ticker-dot"></span> SKYLINE TOWER: 32 FLOORS (145M)</div>
        <div className="ticker-item">WIND AT 145M: <strong>14.2 KTS NW</strong></div>
        <div className="ticker-item">CORE HYDRATION TEMP: <strong>32.8°C</strong></div>
        <div className="ticker-item">SEISMIC SENSOR: <strong>0.012G NOMINAL</strong></div>
        <div className="ticker-item">CRANE #1: <strong>ONLINE (0.8 T LOAD)</strong></div>
        <div className="ticker-item">MAHARERA: <strong>P51800034512</strong></div>
      </div>

      <div className="shell-body">
        {/* SIDEBAR */}
        <aside>
          <div className="brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="brand-badge-icon">
              <i className="fa-solid fa-cube"></i>
            </div>
            <div className="brand-text">
              <span>SKYLINE TOWER</span>
              <small>32-Storey BIM & OS</small>
            </div>
          </div>

          <div className="sidebar-section-label">Command Center</div>
          <ul className="nav-list">
            <li>
              <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <i className="fa-solid fa-gauge-high"></i> Executive Dashboard
              </button>
            </li>
            <li>
              <button className={`nav-item ${activeTab === 'digitaltwin' ? 'active' : ''}`} onClick={() => setActiveTab('digitaltwin')}>
                <i className="fa-solid fa-image"></i> Real BIM Render View
              </button>
            </li>
            <li>
              <button className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
                <i className="fa-solid fa-id-card-clip"></i> Workforce Ledger
              </button>
            </li>
            <li>
              <button className={`nav-item ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
                <i className="fa-solid fa-user-plus"></i> Operative Enrollment
              </button>
            </li>
          </ul>

          <div className="sidebar-section-label">Logistics & Capital</div>
          <ul className="nav-list">
            <li>
              <button className={`nav-item ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>
                <i className="fa-solid fa-boxes-stacked"></i> Material Logistics
              </button>
            </li>
            <li>
              <button className={`nav-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
                <i className="fa-solid fa-receipt"></i> Financial Control
              </button>
            </li>
            <li>
              <button className={`nav-item ${activeTab === 'procurement' ? 'active' : ''}`} onClick={() => setActiveTab('procurement')}>
                <i className="fa-solid fa-file-invoice-dollar"></i> Procurement & POs
              </button>
            </li>
          </ul>

          <div className="executive-signoff-card">
            <div className="signoff-header">
              <span className="signoff-dot"></span>
              <span>AUTHENTICATED PORTAL USER</span>
            </div>
            <p className="signoff-name">{user ? user.name : 'Guest Session'}</p>
            <small className="signoff-title">{user ? user.role : 'Unauthenticated'}</small>
            <div className="signoff-credentials">
              <div>AUTH: SECURE SESSION</div>
              <div>ID: BKC-ZONE4</div>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main>
          <header className="topbar">
            <div className="search-wrapper" onClick={() => setCmdPaletteOpen(true)}>
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                className="search-input"
                placeholder="Command Bar (Ctrl + K)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="search-kbd">Ctrl K</kbd>
            </div>

            <div className="topbar-actions">
              <div className="telemetry-pill">
                <span className="telemetry-item">
                  <i className="fa-regular fa-sun"></i> 31°C
                </span>
                <span className="telemetry-sep"></span>
                <span className="telemetry-item">
                  <span className="telemetry-dot"></span> AQI 118
                </span>
                <span className="telemetry-sep"></span>
                <span className="telemetry-item">
                  <i className="fa-solid fa-droplet"></i> 72%
                </span>
              </div>

              <div className="actions-divider"></div>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className={`icon-btn ${notificationsOpen ? 'active' : ''}`}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Alerts"
                >
                  <i className="fa-regular fa-bell"></i>
                  <span className="icon-badge-dot"></span>
                </button>

                {notificationsOpen && (
                  <div className="dropdown-panel">
                    <div className="dropdown-header">
                      <h4>Site Alerts & Dispatch Logs</h4>
                      <button className="btn-link" onClick={() => triggerToast("Cleared notifications")}>Clear</button>
                    </div>
                    <div className="notif-item unread">
                      <span className="notif-indicator"></span>
                      <div>
                        <strong>Glass Facade Consignment Arrived</strong>
                        <p>Saint-Gobain toughened glass panels cleared at Gate 2.</p>
                        <small>12 mins ago</small>
                      </div>
                    </div>
                    <div className="notif-item">
                      <div>
                        <strong>Level 24 Deck Pour Approved</strong>
                        <p>Structural engineer signed off on high-rise rebar grid.</p>
                        <small>1 hour ago</small>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button 
                type="button" 
                className="icon-btn" 
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                <i className={theme === 'light' ? 'fa-regular fa-moon' : 'fa-regular fa-sun'}></i>
              </button>

              <div className="actions-divider"></div>

              {/* User Capsule / Login Button */}
              {!user ? (
                <button type="button" className="btn-primary" onClick={() => setIsModalOpen(true)}>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In
                </button>
              ) : (
                <div className="user-capsule">
                  <div className="avatar-circle">{user.avatar}</div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role.includes('Management') ? 'Admin' : 'Staff'}</span>
                  </div>
                  <button 
                    type="button" 
                    className="logout-ghost-btn" 
                    title="Sign Out" 
                    onClick={() => { setUser(null); triggerToast("Signed out successfully"); setIsModalOpen(true); }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="content">
            {activeTab === 'dashboard' && (
              <div>
                <div className="dash-top">
                  <div>
                    <div className="project-breadcrumbs">
                      <span>Apex Infrastructures</span> / <span>Mumbai Commercial</span> / <strong>Skyline Tower (32 Floors)</strong>
                    </div>
                    <h1>Executive Operations Command</h1>
                    <p className="sub-text"><i className="fa-solid fa-location-dot"></i> Plot C-44, G-Block, Bandra Kurla Complex, Mumbai &bull; 145m Commercial High-Rise</p>
                  </div>
                  <div className="btn-group">
                    <select 
                      className="select-styled" 
                      value={selectedFiscalYear} 
                      onChange={(e) => { setSelectedFiscalYear(e.target.value); triggerToast(`Cycle: ${e.target.value}`); }}
                    >
                      <option value="FY 2026-27">FY 2026-27 (Active Cycle)</option>
                      <option value="FY 2025-26">FY 2025-26 (Audited)</option>
                    </select>
                    <button className="btn-secondary" onClick={handleDownloadExecutiveBrief}>
                      <i className="fa-solid fa-file-arrow-down"></i> Executive Brief
                    </button>
                  </div>
                </div>

                {/* REAL PHOTO BIM COCKPIT */}
                <div className="bim-split-viewport">
                  <div className="bim-canvas-card" style={{ padding: 0, overflow: 'hidden', height: '340px', position: 'relative' }}>
                    <img 
                      src="/ChatGPT Image Sep 9, 2026, 11_10_42 PM.png" 
                      alt="Skyline Tower Real Render" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <div className="bim-overlay-hud">
                      <div><strong>ARCHITECTURAL RENDER:</strong> SKYLINE TOWER BKC</div>
                      <div><strong>HEIGHT:</strong> 145M &bull; <strong>FLOORS:</strong> 32 STOREYS</div>
                    </div>
                  </div>

                  <div className="bim-inspector-card">
                    <div className="bim-card-header">
                      <span>SLAB INSPECTOR (REAL PHOTO SYNC)</span>
                      <span className="badge badge-green">L{activeFloorInspect} SELECTED</span>
                    </div>

                    <div className="floor-quick-stepper" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                      {[31, 28, 24, 20, 16, 12, 8, 4, 2, 1].map(fl => (
                        <button
                          key={fl}
                          className={`floor-step-btn ${activeFloorInspect === fl ? 'active' : ''}`}
                          onClick={() => setActiveFloorInspect(fl)}
                        >
                          L{fl}
                        </button>
                      ))}
                    </div>

                    <div className="dossier-metrics-list">
                      <div className="dossier-item">
                        <span className="dossier-k">Structural Status:</span>
                        <span className="dossier-v" style={{ color: activeFloorInspect <= 24 ? '#16a34a' : '#f97316' }}>
                          {activeFloorInspect <= 5 ? 'Podium Retail & Amenity' : activeFloorInspect <= 24 ? 'Cured (Grade M35)' : 'Active High-Rise Core'}
                        </span>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-k">Curtain Wall Glazing:</span>
                        <span className="dossier-v">Saint-Gobain 12mm Toughened Glass</span>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-k">Structural Core:</span>
                        <span className="dossier-v">Central Lift Shaft + Dual Stairwells</span>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-k">Assigned Operatives on Deck:</span>
                        <span className="dossier-v">
                          {employees.filter(e => e.floor === activeFloorInspect).length} Personnel Assigned
                        </span>
                      </div>
                    </div>

                    <button 
                      className="btn-primary full-btn" 
                      style={{ marginTop: 'auto' }}
                      onClick={() => triggerToast(`Level ${activeFloorInspect} architectural audit signed`)}
                    >
                      <i className="fa-solid fa-signature"></i> Sign Off Level {activeFloorInspect} Audit
                    </button>
                  </div>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card">
                    <div className="kpi-title">Deployed Workforce</div>
                    <div className="kpi-val-group">
                      <span className="kpi-value">{employees.filter(e => e.status === 'Active').length} / {employees.length}</span>
                      <i className="fa-solid fa-users text-dim"></i>
                    </div>
                    <span className="badge badge-green"><i className="fa-solid fa-circle-check"></i> Standard Shift Running</span>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-title">Critical Path Milestone</div>
                    <div className="kpi-val-group">
                      <span className="kpi-value">18 Days</span>
                      <i className="fa-solid fa-hourglass-half text-dim"></i>
                    </div>
                    <span className="badge badge-red">Level 24 Tower Suite Slab</span>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-title">Procured Material Capital</div>
                    <div className="kpi-val-group">
                      <span className="kpi-value">
                        &#8377; {(materials.reduce((a, b) => a + (b.brought * b.rate), 0) / 100000).toFixed(2)} L
                      </span>
                      <i className="fa-solid fa-indian-rupee-sign text-dim"></i>
                    </div>
                    <span className="badge badge-yellow">6 Commodities In Warehouse</span>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-title">Structural Completion</div>
                    <div className="kpi-val-group">
                      <span className="kpi-value">75.0%</span>
                      <i className="fa-solid fa-building text-dim"></i>
                    </div>
                    <span className="badge badge-green"><i className="fa-solid fa-arrow-up"></i> 32 Floors Total</span>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <h3>Capital Drawdown Trajectory (&#8377; in Lakhs)</h3>
                        <div className="card-legend">
                          <div className="legend-item"><span className="dot" style={{ background: '#f97316' }}></span> Actual Outlay: <strong>&#8377; 482.00 L</strong></div>
                          <div className="legend-item"><span className="dot" style={{ background: '#3b82f6' }}></span> Scheduled Baseline: <strong>&#8377; 520.00 L</strong></div>
                        </div>
                      </div>
                      <button className="btn-secondary" onClick={() => setActiveTab('finance')}>View Ledger</button>
                    </div>
                    <div style={{ height: '240px' }}>
                      <Line data={lineData} options={lineOptions} />
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3>Statutory Compliance Audit</h3>
                      <span className="badge badge-green">100% Passed</span>
                    </div>
                    <ul className="compliance-list">
                      <li className="compliance-item">
                        <div className="compliance-icon" style={{ background: '#f97316' }}><i className="fa-solid fa-id-card"></i></div>
                        <div style={{ flex: 1 }}>
                          <div className="compliance-label">PF & ESIC Statutory Labor Roll</div>
                          <div className="bar-bg"><div className="bar-fill" style={{ width: '100%', background: '#f97316' }}></div></div>
                        </div>
                        <span className="badge badge-green">100%</span>
                      </li>
                      <li className="compliance-item">
                        <div className="compliance-icon" style={{ background: '#10b981' }}><i className="fa-solid fa-vest"></i></div>
                        <div style={{ flex: 1 }}>
                          <div className="compliance-label">Site Safety PPE Enforcement</div>
                          <div className="bar-bg"><div className="bar-fill" style={{ width: '94%', background: '#10b981' }}></div></div>
                        </div>
                        <span className="badge badge-green">94%</span>
                      </li>
                      <li className="compliance-item">
                        <div className="compliance-icon" style={{ background: '#3b82f6' }}><i className="fa-solid fa-flask"></i></div>
                        <div style={{ flex: 1 }}>
                          <div className="compliance-label">Concrete 28-Day Curing Certification</div>
                          <div className="bar-bg"><div className="bar-fill" style={{ width: '88%', background: '#3b82f6' }}></div></div>
                        </div>
                        <span className="badge badge-yellow">88%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'digitaltwin' && (
              <div>
                <div className="dash-top">
                  <div>
                    <div className="project-breadcrumbs">
                      <span>Engineering</span> / <strong>Real Architectural BIM Render</strong>
                    </div>
                    <h1>Skyline Tower High-Resolution Visual Spec</h1>
                    <p className="sub-text">Official architectural render used for municipal approvals and MahaRERA structural verification.</p>
                  </div>
                </div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src="/ChatGPT Image Sep 9, 2026, 11_10_42 PM.png" alt="Full Tower Render" style={{ width: '100%', display: 'block' }} />
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div>
                <div className="dash-top">
                  <div>
                    <div className="project-breadcrumbs">
                      <span>Operations</span> / <strong>Workforce & Labor Ledger</strong>
                    </div>
                    <h1>Workforce Roster & Remuneration Control</h1>
                    <p className="sub-text">Click disbursement badges to flip payout status, modify OT hours with +/- steppers, or view printable wage slips.</p>
                  </div>
                  <div className="btn-group">
                    <button className="btn-secondary" onClick={() => setActiveTab('register')}>
                      <i className="fa-solid fa-user-plus"></i> Onboard Operative
                    </button>
                    <button className="btn-primary" onClick={handleExportCSV}>
                      <i className="fa-solid fa-file-csv"></i> Export Payroll (CSV)
                    </button>
                  </div>
                </div>

                <div className="filter-pill-bar">
                  <span className="filter-label"><i className="fa-solid fa-filter"></i> Filter:</span>
                  {['ALL', 'Active', 'Absent', 'Holiday', 'Suspended', 'Inactive', 'UNPAID'].map(pill => (
                    <button
                      key={pill}
                      type="button"
                      className={`filter-pill ${statusFilter === pill ? 'active' : ''}`}
                      onClick={() => setStatusFilter(pill)}
                    >
                      {pill === 'UNPAID' ? 'Pending Payout' : pill}
                      <span className="pill-count">
                        {pill === 'ALL' 
                          ? employees.length 
                          : pill === 'UNPAID'
                            ? employees.filter(e => !e.paid).length
                            : employees.filter(e => e.status === pill).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Personnel ID</th>
                        <th>Operative Name</th>
                        <th>Trade Assignment</th>
                        <th>Demographics</th>
                        <th>Contact</th>
                        <th>Daily Wage</th>
                        <th>OT (Hours)</th>
                        <th>OT Pay</th>
                        <th>Disbursement</th>
                        <th>Deployment</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id}>
                          <td><strong>{emp.id}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{emp.name}</div>
                            <small style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>{emp.address}</small>
                          </td>
                          <td><span className="trade-badge">{emp.role}</span></td>
                          <td>{emp.age}Y &bull; {emp.gender}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{emp.contact}</td>
                          <td>&#8377; {emp.wage.toLocaleString('en-IN')}</td>
                          <td>
                            <div className="ot-stepper">
                              <button className="ot-btn" onClick={() => updateOtHours(emp.id, -0.5)}>-</button>
                              <span className="ot-display">{emp.otHours} hrs</span>
                              <button className="ot-btn" onClick={() => updateOtHours(emp.id, 0.5)}>+</button>
                            </div>
                          </td>
                          <td>&#8377; {emp.overtime.toLocaleString('en-IN')}</td>
                          <td>
                            <button
                              type="button"
                              className={`status-badge click-toggle ${emp.paid ? 'status-paid' : 'status-unpaid'}`}
                              onClick={() => togglePaidStatus(emp.id)}
                            >
                              <i className={emp.paid ? "fa-solid fa-check" : "fa-solid fa-clock"}></i>
                              {emp.paid ? 'Disbursed' : 'Pending'}
                            </button>
                          </td>
                          <td>
                            <select
                              className={`status-select ${getStatusClass(emp.status)}`}
                              value={emp.status}
                              onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Suspended">Suspended</option>
                              <option value="Holiday">Holiday</option>
                              <option value="Absent">Absent</option>
                              <option value="Terminated">Terminated</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button 
                                className="btn-action-icon" 
                                title="Generate Indian Wage Slip" 
                                onClick={() => setSelectedPayslipEmp(emp)}
                              >
                                <i className="fa-solid fa-file-invoice-dollar"></i>
                              </button>
                              <button 
                                className="btn-danger-icon" 
                                title="Decommission Operative" 
                                onClick={() => removeEmployee(emp.id, emp.name)}
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <div className="dash-top">
                  <div>
                    <div className="project-breadcrumbs">
                      <span>Supply Chain</span> / <strong>Godown Logistics</strong>
                    </div>
                    <h1>Material Inventory Ledger & Reorder Triggers</h1>
                    <p className="sub-text">Modify quantities or unit rates directly in the table to update godown valuation and trigger safety reorder alerts.</p>
                  </div>
                  <div className="btn-group">
                    <button className="btn-primary" onClick={() => setActiveTab('procurement')}>
                      <i className="fa-solid fa-cart-plus"></i> Draft Purchase Order
                    </button>
                  </div>
                </div>

                <div className="material-quick-grid">
                  {materials.map(m => {
                    const onSite = m.brought - m.used;
                    const isLow = onSite <= m.threshold;
                    return (
                      <div key={m.id} className="godown-card">
                        <div className="godown-header">
                          <h4>{m.name}</h4>
                          {isLow ? (
                            <span className="badge badge-red">Critical Low</span>
                          ) : (
                            <span className="badge badge-green">In Stock</span>
                          )}
                        </div>
                        <div className="godown-metrics">
                          <div>
                            <div className="text-muted-xs">Godown Balance</div>
                            <div className="metric-val">{onSite.toLocaleString('en-IN')} <small>{m.unit}</small></div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="text-muted-xs">Safety Threshold</div>
                            <div className="metric-sub">{m.threshold} {m.unit}</div>
                          </div>
                        </div>
                        <div className="bar-bg" style={{ marginTop: '10px' }}>
                          <div 
                            className="bar-fill" 
                            style={{ 
                              width: `${Math.min(100, Math.max(10, (onSite / m.brought) * 100))}%`,
                              background: isLow ? '#ef4444' : '#3b82f6'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Material Commodity</th>
                        <th>UOM</th>
                        <th style={{ width: '130px' }}>Quantity Brought</th>
                        <th style={{ width: '130px' }}>Quantity Used</th>
                        <th>Godown Balance</th>
                        <th style={{ width: '130px' }}>Shortfall Needed</th>
                        <th style={{ width: '140px' }}>Unit Rate (₹)</th>
                        <th>Committed Outflow</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map(item => {
                        const balance = item.brought - item.used;
                        const isLow = balance <= item.threshold;
                        const committed = item.brought * item.rate;
                        return (
                          <tr key={item.id}>
                            <td><strong>{item.name}</strong></td>
                            <td><span className="trade-badge">{item.unit}</span></td>
                            <td>
                              <input 
                                type="number"
                                className="table-input"
                                value={item.brought}
                                onChange={(e) => updateMaterialField(item.id, 'brought', e.target.value)}
                              />
                            </td>
                            <td>
                              <input 
                                type="number"
                                className="table-input"
                                value={item.used}
                                onChange={(e) => updateMaterialField(item.id, 'used', e.target.value)}
                              />
                            </td>
                            <td>
                              <span className={`status-badge ${isLow ? 'status-unpaid' : 'status-paid'}`}>
                                {balance.toLocaleString('en-IN')} {item.unit}
                              </span>
                            </td>
                            <td>
                              <input 
                                type="number"
                                className="table-input"
                                value={item.needed}
                                onChange={(e) => updateMaterialField(item.id, 'needed', e.target.value)}
                              />
                            </td>
                            <td>
                              <input 
                                type="number"
                                className="table-input"
                                value={item.rate}
                                onChange={(e) => updateMaterialField(item.id, 'rate', e.target.value)}
                              />
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>
                              &#8377; {committed.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: 'var(--bg-subtle)', fontWeight: 700 }}>
                        <td colSpan="7" style={{ textAlign: 'right', padding: '12px' }}>Total Material Capital Deployed:</td>
                        <td style={{ padding: '12px', color: 'var(--brand-accent)', fontFamily: 'var(--font-mono)' }}>
                          &#8377; {materials.reduce((s, m) => s + (m.brought * m.rate), 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div>
                <div className="dash-top">
                  <div>
                    <div className="project-breadcrumbs">
                      <span>Finance</span> / <strong>Cash Flow & Petty Outflows</strong>
                    </div>
                    <h1>Financial Control & Site Cash Flow</h1>
                    <p className="sub-text">Authorized petty expenditure records for generator fuel, machinery shift rentals, and lab cube tests.</p>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Voucher ID</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th>Amount (₹)</th>
                          <th>Authority</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map(exp => (
                          <tr key={exp.id}>
                            <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{exp.id}</strong></td>
                            <td>{exp.description}</td>
                            <td><span className="trade-badge">{exp.category}</span></td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>&#8377; {exp.amount.toLocaleString('en-IN')}</td>
                            <td><small>{exp.authorizedBy}</small></td>
                            <td><span className="badge badge-green">{exp.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3>Record Daily Petty Disbursement</h3>
                    </div>
                    <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="form-group">
                        <label>Expense Narrative</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Transit Mixer Water Jet Flushing" 
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select 
                          value={newExpense.category} 
                          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        >
                          <option value="Auxiliary Power">Auxiliary Power (Diesel)</option>
                          <option value="Site Utilities">Site Utilities (Water/Sanitation)</option>
                          <option value="Plant Machinery">Plant Machinery Hire</option>
                          <option value="Quality & Testing">Quality & Testing Lab</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Disbursement Sum (₹)</label>
                        <input 
                          type="number" 
                          placeholder="e.g., 14500" 
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                        <i className="fa-solid fa-check"></i> Authorize & Commit Voucher
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'procurement' && (
              <div>
                <div className="dash-top">
                  <div>
                    <div className="project-breadcrumbs">
                      <span>Procurement</span> / <strong>Purchase Requisitions</strong>
                    </div>
                    <h1>Purchase Orders & Vendor Requisitions</h1>
                    <p className="sub-text">Dispatch commercial purchase orders to approved vendors with automated 18% GST calculation.</p>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>PO Reference</th>
                          <th>Vendor / Supplier</th>
                          <th>Material Item</th>
                          <th>Order Volume</th>
                          <th>Base Price</th>
                          <th>Total (+18% GST)</th>
                          <th>Approval</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseOrders.map(po => {
                          const sub = po.qty * po.unitRate;
                          const total = sub * 1.18;
                          return (
                            <tr key={po.id}>
                              <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{po.id}</strong></td>
                              <td>{po.vendor}</td>
                              <td>{po.item}</td>
                              <td>{po.qty} {po.unit}</td>
                              <td>&#8377; {po.unitRate.toLocaleString('en-IN')}</td>
                              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                &#8377; {Math.round(total).toLocaleString('en-IN')}
                              </td>
                              <td>
                                <button 
                                  className={`status-badge click-toggle ${po.status === 'Authorized' ? 'status-paid' : 'status-unpaid'}`}
                                  onClick={() => togglePOStatus(po.id)}
                                >
                                  {po.status}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3>Draft Commercial PO</h3>
                    </div>
                    <form onSubmit={handleCreatePO} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="form-group">
                        <label>Vendor Entity</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Saint-Gobain Glass India" 
                          value={newPO.vendor} 
                          onChange={(e) => setNewPO({ ...newPO, vendor: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Material Commodity</label>
                        <select 
                          value={newPO.item} 
                          onChange={(e) => {
                            const val = e.target.value;
                            const match = materials.find(m => m.name === val);
                            setNewPO({
                              ...newPO,
                              item: val,
                              unit: match ? match.unit : 'Bags',
                              unitRate: match ? match.rate.toString() : '4850'
                            });
                          }}
                        >
                          {materials.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Quantity ({newPO.unit})</label>
                          <input 
                            type="number" 
                            placeholder="e.g., 200" 
                            value={newPO.qty} 
                            onChange={(e) => setNewPO({ ...newPO, qty: e.target.value })} 
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Unit Rate (₹)</label>
                          <input 
                            type="number" 
                            value={newPO.unitRate} 
                            onChange={(e) => setNewPO({ ...newPO, unitRate: e.target.value })} 
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                        <i className="fa-solid fa-file-signature"></i> Approve & Issue PO
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'register' && (
              <div>
                <div className="dash-top">
                  <div>
                    <div className="project-breadcrumbs">
                      <span>Administration</span> / <strong>Personnel Registration</strong>
                    </div>
                    <h1>Operative Credentialing & Enrollment</h1>
                    <p className="sub-text">Enroll engineering personnel, safety stewards, or heavy machinery operators into the Skyline database.</p>
                  </div>
                </div>

                <div className="card form-container">
                  {/* --- NEW: FETCH POST LOGIC INTEGRATED HERE --- */}
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const wage = parseFloat(formData.empWage) || 850;
                    const otHours = parseFloat(formData.empOtHours) || 0;
                    
                    const newEmp = {
                      id: formData.empId.trim() || `ST-${Math.floor(2015 + Math.random() * 50)}`,
                      name: formData.empName.trim(),
                      role: formData.role.trim() || 'General Tradesperson',
                      age: parseInt(formData.empAge) || 28,
                      gender: formData.empGender,
                      contact: `+91 ${formData.empContact.trim()}`,
                      address: formData.empAddress.trim(),
                      wage: wage,
                      otHours: otHours,
                      overtime: Math.round(otHours * (wage / 8) * 1.5),
                      paid: false,
                      status: "Active",
                      floor: 24
                    };

                    // Send strictly what the Spring Boot backend knows how to save
                    const backendPayload = {
                      id: newEmp.id,
                      name: newEmp.name,
                      age: newEmp.age,
                      gender: newEmp.gender,
                      contact: newEmp.contact,
                      address: newEmp.address,
                      wage: newEmp.wage,
                      otHours: newEmp.otHours,
                      active: true
                    };

                    try {
                      const response = await fetch('http://localhost:8080/api/employees', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(backendPayload)
                      });

                      if (response.ok) {
                        const savedEmp = await response.json();
                        setEmployees([{ ...newEmp, id: savedEmp.id }, ...employees]);
                        triggerToast(`Operative ${newEmp.name} enrolled into project`);
                        setActiveTab('employees');
                      } else {
                        triggerToast("Backend Error: Failed to save to MySQL database.");
                      }
                    } catch (error) {
                      console.error("Connection Error:", error);
                      triggerToast("Connection Error: Is Spring Boot running?");
                    }
                  }}>
                  {/* ------------------------------------------- */}
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Personnel ID (Unique Asset ID)</label>
                        <input 
                          type="text" 
                          placeholder="e.g., ST-2011" 
                          value={formData.empId} 
                          onChange={(e) => setFormData({ ...formData, empId: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Full Legal Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Vikram Chauhan" 
                          value={formData.empName} 
                          onChange={(e) => setFormData({ ...formData, empName: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Assigned Trade / Job Role</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Concrete Pump Operator" 
                          value={formData.role} 
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Age</label>
                        <input 
                          type="number" 
                          min="18" 
                          max="65" 
                          placeholder="28" 
                          value={formData.empAge} 
                          onChange={(e) => setFormData({ ...formData, empAge: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select 
                          value={formData.empGender} 
                          onChange={(e) => setFormData({ ...formData, empGender: e.target.value })}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Contact Phone (+91)</label>
                        <input 
                          type="tel" 
                          pattern="[6-9][0-9]{9}" 
                          placeholder="10-digit mobile number" 
                          value={formData.empContact} 
                          onChange={(e) => setFormData({ ...formData, empContact: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Daily Remuneration Rate (₹)</label>
                        <input 
                          type="number" 
                          placeholder="e.g., 900" 
                          value={formData.empWage} 
                          onChange={(e) => setFormData({ ...formData, empWage: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Initial Overtime (Hours)</label>
                        <input 
                          type="number" 
                          step="0.5" 
                          value={formData.empOtHours} 
                          onChange={(e) => setFormData({ ...formData, empOtHours: e.target.value })} 
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Permanent Residential Address</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Sector 17, Vashi, Navi Mumbai, Maharashtra" 
                          value={formData.empAddress} 
                          onChange={(e) => setFormData({ ...formData, empAddress: e.target.value })} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        <i className="fa-solid fa-plus"></i> Complete Onboarding
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* SPOTLIGHT COMMAND PALETTE MODAL (Ctrl + K) */}
      {cmdPaletteOpen && (
        <div className="modal-overlay" onClick={() => setCmdPaletteOpen(false)}>
          <div className="cmd-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cmd-header">
              <i className="fa-solid fa-terminal"></i>
              <input 
                type="text" 
                placeholder="Type command or jump to module..." 
                autoFocus 
                className="cmd-input"
              />
              <kbd>ESC</kbd>
            </div>
            <div className="cmd-list">
              <div className="cmd-section">CORE NAVIGATION</div>
              <div className="cmd-item" onClick={() => { setActiveTab('dashboard'); setCmdPaletteOpen(false); }}>
                <i className="fa-solid fa-gauge-high"></i> Jump to Executive Dashboard
              </div>
              <div className="cmd-item" onClick={() => { setActiveTab('digitaltwin'); setCmdPaletteOpen(false); }}>
                <i className="fa-solid fa-image"></i> View Real Architectural Render
              </div>
              <div className="cmd-item" onClick={() => { setActiveTab('employees'); setCmdPaletteOpen(false); }}>
                <i className="fa-solid fa-id-card-clip"></i> Open Workforce Roster
              </div>
              <div className="cmd-item" onClick={() => { setActiveTab('materials'); setCmdPaletteOpen(false); }}>
                <i className="fa-solid fa-boxes-stacked"></i> Material Logistics Ledger
              </div>
              <div className="cmd-section">EXECUTIVE ACTIONS</div>
              <div className="cmd-item" onClick={() => { handleDownloadExecutiveBrief(); setCmdPaletteOpen(false); }}>
                <i className="fa-solid fa-file-arrow-down"></i> Generate Director Audit Brief
              </div>
              <div className="cmd-item" onClick={() => { handleExportCSV(); setCmdPaletteOpen(false); }}>
                <i className="fa-solid fa-file-csv"></i> Download Payroll CSV
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUTORY INDIAN WAGE SLIP MODAL */}
      {selectedPayslipEmp && (
        <div className="modal-overlay">
          <div className="modal-box payslip-modal-box">
            <div className="payslip-wrapper" id="printable-payslip">
              <div className="payslip-header">
                <div>
                  <h2>APEX INFRASTRUCTURES PVT. LTD.</h2>
                  <p>Plot C-44, G-Block, Bandra Kurla Complex, Mumbai - 400051 &bull; GSTIN: 27AABCA1234F1Z5</p>
                </div>
                <div className="payslip-badge">FORM XIX &bull; WAGE SLIP</div>
              </div>

              <hr className="payslip-divider" />

              <div className="payslip-grid">
                <div>
                  <div className="slip-label">Personnel ID:</div>
                  <div className="slip-val">{selectedPayslipEmp.id}</div>
                </div>
                <div>
                  <div className="slip-label">Operative Name:</div>
                  <div className="slip-val">{selectedPayslipEmp.name}</div>
                </div>
                <div>
                  <div className="slip-label">Trade Designation:</div>
                  <div className="slip-val">{selectedPayslipEmp.role}</div>
                </div>
                <div>
                  <div className="slip-label">Payment Cycle:</div>
                  <div className="slip-val">{selectedFiscalYear}</div>
                </div>
                <div>
                  <div className="slip-label">Attendance Status:</div>
                  <div className="slip-val">{selectedPayslipEmp.status}</div>
                </div>
                <div>
                  <div className="slip-label">Contact:</div>
                  <div className="slip-val">{selectedPayslipEmp.contact}</div>
                </div>
              </div>

              <table className="slip-calc-table">
                <thead>
                  <tr>
                    <th>Earnings Component</th>
                    <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                    <th>Statutory Deductions</th>
                    <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Haziri (Daily Rate)</td>
                    <td style={{ textAlign: 'right' }}>{selectedPayslipEmp.wage.toFixed(2)}</td>
                    <td>Provident Fund (EPF - 12%)</td>
                    <td style={{ textAlign: 'right' }}>{(selectedPayslipEmp.wage * 0.12).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Overtime Pay ({selectedPayslipEmp.otHours} hrs @ 1.5x)</td>
                    <td style={{ textAlign: 'right' }}>{selectedPayslipEmp.overtime.toFixed(2)}</td>
                    <td>ESIC Contribution (0.75%)</td>
                    <td style={{ textAlign: 'right' }}>{(selectedPayslipEmp.wage * 0.0075).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Site Conveyance Allowance</td>
                    <td style={{ textAlign: 'right' }}>150.00</td>
                    <td>Labor Welfare Fund (LWF)</td>
                    <td style={{ textAlign: 'right' }}>10.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th>Gross Remuneration:</th>
                    <th style={{ textAlign: 'right' }}>
                      ₹ {(selectedPayslipEmp.wage + selectedPayslipEmp.overtime + 150).toFixed(2)}
                    </th>
                    <th>Total Deductions:</th>
                    <th style={{ textAlign: 'right' }}>
                      ₹ {((selectedPayslipEmp.wage * 0.12) + (selectedPayslipEmp.wage * 0.0075) + 10).toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </table>

              <div className="payslip-net-box">
                <div>
                  <span className="text-muted-xs">NET DISBURSEMENT PAYABLE</span>
                  <h3>
                    ₹ {(
                      (selectedPayslipEmp.wage + selectedPayslipEmp.overtime + 150) - 
                      ((selectedPayslipEmp.wage * 0.12) + (selectedPayslipEmp.wage * 0.0075) + 10)
                    ).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
                <span className={`status-badge ${selectedPayslipEmp.paid ? 'status-paid' : 'status-unpaid'}`}>
                  {selectedPayslipEmp.paid ? 'DISBURSED VIA NEFT/RTGS' : 'PAYMENT PENDING SIGN-OFF'}
                </span>
              </div>

              <div className="payslip-footer">
                <div>Certified by: Harshit Pandey (Chief Executive Officer)</div>
                <div>Worker Signature / Biometric Thumbprint</div>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button type="button" className="btn-secondary" onClick={() => setSelectedPayslipEmp(null)}>Close</button>
              <button type="button" className="btn-primary" onClick={() => window.print()}>
                <i className="fa-solid fa-print"></i> Print Wage Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN AUTHENTICATION MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <div className="brand" style={{ marginBottom: 0, paddingLeft: 0 }}>
                <div className="brand-badge-icon">
                  <i className="fa-solid fa-building-shield"></i>
                </div>
                <div className="brand-text">
                  <span>APEX INFRA</span>
                  <small>Portal Authentication</small>
                </div>
              </div>
              {/* Only allow closing if user is actually authenticated */}
              {user && <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>}
            </div>

            <div className="auth-role-tabs">
              <button
                type="button"
                className={`role-tab ${loginTab === 'staff' ? 'active' : ''}`}
                onClick={() => setLoginTab('staff')}
              >
                <i className="fa-solid fa-helmet-safety"></i> Staff
              </button>
              <button
                type="button"
                className={`role-tab ${loginTab === 'management' ? 'active' : ''}`}
                onClick={() => setLoginTab('management')}
              >
                <i className="fa-solid fa-user-tie"></i> Management
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>{loginTab === 'staff' ? 'Operative Name' : 'Admin / Executive Name'}</label>
                <input
                  type="text"
                  placeholder={loginTab === 'staff' ? 'e.g., Rajesh Sharma' : 'e.g., Harshit Pandey'}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label>Security Passcode</label>
                <input
                  type="password"
                  placeholder="Enter passcode"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>

              {loginError && <div className="login-error-msg">{loginError}</div>}

              <button type="submit" className="btn-primary full-btn">
                <i className="fa-solid fa-lock"></i> Authorize & Enter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}