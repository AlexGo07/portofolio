import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Expandable Card Component
function ExpandableCard({ sec }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      style={{ 
        background: "#f9fafb", 
        borderRadius: "12px", 
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: expanded ? "2px solid #3b82f6" : "1px solid #e5e7eb",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        transform: expanded ? "scale(1.02)" : "scale(1)",
        padding: "12px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: "0", fontSize: "1.05rem", color: "#2563eb", fontWeight: 700 }}>
          {sec.subtitle}
        </h3>
        <span style={{ color: "#6b7280", fontSize: "1.2rem", marginLeft: "8px", lineHeight: 1 }}>
          {expanded ? "−" : "+"}
        </span>
      </div>

      {!expanded && (
        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {sec.text}
        </p>
      )}

      {expanded && (
        <div style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          animation: "fadeIn 0.3s ease-in-out"
        }}>
          {sec.image && (
            <img 
              src={sec.image} 
              alt={sec.subtitle} 
              style={{ width: "100%", height: "100px", objectFit: "cover", objectPosition: "center", borderRadius: "8px" }}
            />
          )}

          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.4, color: "#374151", fontWeight: 600 }}>
            {sec.text}
          </p>
          
          {sec.details && (
            <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.4, color: "#4b5563", whiteSpace: "pre-line" }}>
              {sec.details}
            </p>
          )}

          {sec.cardLinks && sec.cardLinks.length > 0 && (
            <div style={{ marginTop: "4px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {sec.cardLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()} // prevent card collapsing
                  style={{
                    textDecoration: "none",
                    background: "#e0e7ff",
                    color: "#1d4ed8",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.85rem"
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckpointCard({ position }) {
  const markerRef = useRef();

  useFrame((state) => {
    // Keep the marker alive with a small float effect.
    if (markerRef.current) {
      markerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* 3D Map Pin floating on top of the building */}
      <group ref={markerRef}>
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#FF3366" emissive="#FF0000" emissiveIntensity={0.2} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1, 2, 16]} />
          <meshStandardMaterial color="#FF3366" roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function CarModel() {
  const { scene } = useGLTF("/1989_porsche_911_964_carrera_4.glb");
  // Adjust scale back down, rotate to see if it makes sense.
  return <primitive object={scene} scale={[100, 100, 100]} position={[0, -0.5, 0]} />;
}

function MapModel() {
  const { scene } = useGLTF("/lowpoly_city.glb");
  // position={[X, Y, Z]} moves the map left/right, up/down, forward/backwards
  // rotation={[X, Y, Z]} rotates the map. Y is the vertical axis (spinning it around).
  // Math.PI / 2 = 90 degrees. Math.PI = 180 degrees.
  return <primitive object={scene} position={[0, -1, 0]} rotation={[0, Math.PI / 2, 0]} />; 
}

function Experience({ checkpoints, onActiveCheckpointChange }) {
  const scroll = useScroll();
  const carWrapperRef = useRef();
  const activeCheckpointRef = useRef(null);

  const getFocusTargetForPin = (pinPosition) => {
    return new THREE.Vector3(pinPosition[0], pinPosition[1] + 14, pinPosition[2]);
  };

  const getFocusCameraPosForPin = (pinPosition) => {
    return new THREE.Vector3(pinPosition[0] + 12, pinPosition[1] + 16, pinPosition[2] + 12);
  };

  useEffect(() => {
    if (scroll?.el) {
      scroll.el.id = "r3f-scroll-area";
    }
  }, [scroll]);
  
  const curvePoints = [
    new THREE.Vector3(58, 0, 71),// Start point (adjusted to be on the road)
    new THREE.Vector3(60,0,50), // First curve point (adjusted to be on the road)
    new THREE.Vector3(57,0,39), // Second curve point (adjusted to be on the road)
    new THREE.Vector3(60,0,5), // Third curve point (adjusted to be on the road)
    new THREE.Vector3(58, 0, -10), // Fourth curve point (adjusted to be on the road)
    new THREE.Vector3(56, 0, -12),// Fifth curve point (adjusted to be on the road)
    new THREE.Vector3(35, 0, -14),// Fifth curve point (adjusted to be on the road)
    new THREE.Vector3(20, 0, -14),// Sixth curve point (adjusted to be on the road)
    new THREE.Vector3(10, 0, -14),// Sixth curve point (adjusted to be on the road)
    new THREE.Vector3(-10,0,-11), // Sixth curve point (adjusted to be on the road)
    new THREE.Vector3(-10, 0, 1),// Seventh curve point (adjusted to be on the road)
    new THREE.Vector3(-10, 0, 7),// Eighth curve point (adjusted to be on the road)
    new THREE.Vector3(-5, 0,18),// Ninth curve point (adjusted to be on the road)
    new THREE.Vector3(5, 0, 20),// Tenth curve point (adjusted to be on the road)
    new THREE.Vector3(15, 0, 20),// Eleventh curve point (adjusted to be on the road)
    new THREE.Vector3(28, 0, 20),// Twelfth curve point (adjusted to be on the road)
    new THREE.Vector3(30, 0, 34),// Thirteenth curve point (adjusted to be on the road)
    new THREE.Vector3(25, 0,36),// Fourteenth curve point (adjusted to be on the road)
    new THREE.Vector3(20, 0, 36),// Fifteenth curve point (adjusted to be on the road)
    new THREE.Vector3(15, 0, 36),// Sixteenth curve point (adjusted to be on the road)
    new THREE.Vector3(15, 0, 40),// Sixteenth curve point (adjusted to be on the road)
  ];
  const curve = new THREE.CatmullRomCurve3(curvePoints);

  useFrame((state) => {
    const rawTime = scroll.offset;
    const introDuration = 0.08; 
    
    // --- CAR MOVEMENT LOGIC ---
    // Car moves from the very start, slower during intro zoom, then normal speed.
    // We still drive in reverse timeline so the route starts from the old parking area.
    const introCarProgress = 0.12;
    let carTime = 0;
    if (rawTime < introDuration) {
      const introT = rawTime / introDuration;
      carTime = introT * introCarProgress;
    } else {
      const afterIntroT = (rawTime - introDuration) / (1 - introDuration);
      carTime = introCarProgress + afterIntroT * (1 - introCarProgress);
    }
    carTime = THREE.MathUtils.clamp(carTime, 0, 1);

    const driveTime = THREE.MathUtils.clamp(1 - carTime, 0, 1);
    const position = curve.getPoint(driveTime);
    carWrapperRef.current.position.copy(position);

    let carDirection = new THREE.Vector3();
    const lookAtTime = Math.max(driveTime - 0.05, 0);
    const lookAtPos = curve.getPoint(lookAtTime);
    carDirection.subVectors(lookAtPos, position).normalize();
    if (carDirection.lengthSq() === 0) carDirection.set(-1, 0, 0);

    const carLookTarget = new THREE.Vector3().copy(position).add(carDirection);
    carWrapperRef.current.lookAt(carLookTarget);
    
    // Dynamic Camera Tracking
    let camOffsetDir = carDirection.clone().negate();
    
    const normalCameraOffset = new THREE.Vector3()
      .copy(camOffsetDir)
      .multiplyScalar(10)
      .add(new THREE.Vector3(0, 5, 0));

    const normalCameraPos = new THREE.Vector3().copy(position).add(normalCameraOffset);
    const normalLookTarget = new THREE.Vector3().copy(carWrapperRef.current.position).add(new THREE.Vector3(0, 0.5, 0));

    // --- CHECKPOINT ZOOM + MODAL TRIGGER LOGIC ---
    let bestActiveId = null;
    let bestInfluence = 0;

    for (let i = 0; i < checkpoints.length; i++) {
      const poi = checkpoints[i];
      const timeDiff = Math.abs(carTime - poi.time);
      if (timeDiff < poi.duration) {
        // Calculate how deep into the POI zone we are (0.0 at edge, 1.0 at center)
        const dist = 1.0 - (timeDiff / poi.duration); 
        // Smooth bell curve for fading in and out of the zoom
        const easeTarget = dist * dist * (3 - 2 * dist);

        // Keep checkpoint focus tied to each pin location.
        const focusTarget = poi.target || getFocusTargetForPin(poi.pinPosition);
        const focusCamPos = poi.camPos || getFocusCameraPosForPin(poi.pinPosition);

        // Softer pull so transitions are less aggressive and car remains visible.
        normalCameraPos.lerp(focusCamPos, easeTarget * 0.62);
        normalLookTarget.lerp(focusTarget, easeTarget * 0.74);

        if (easeTarget > bestInfluence) {
          bestInfluence = easeTarget;
          bestActiveId = poi.id;
        }
      }
    }

    const shouldShowCheckpoint = bestInfluence > 0.82;
    const nextActiveId = shouldShowCheckpoint ? bestActiveId : null;
    if (activeCheckpointRef.current !== nextActiveId) {
      activeCheckpointRef.current = nextActiveId;
      onActiveCheckpointChange(nextActiveId);
    }

    // --- OUTRO ZOOM-OUT (same old profile, adapted to reversed route) ---
    const totalSegments = curvePoints.length - 1;
    const outroStartTime = 19 / totalSegments;
    const outroStartDriveTime = 1 - outroStartTime;
    if (driveTime <= outroStartDriveTime) {
      const rawProgress = (outroStartDriveTime - driveTime) / outroStartDriveTime;
      const progress = THREE.MathUtils.clamp(rawProgress, 0, 1);
      const ease = progress * progress * (3 - 2 * progress);

      const topCameraPos = new THREE.Vector3(-85, 155, -85);
      const topLookTarget = new THREE.Vector3(0, 0, 0);

      state.camera.position.lerpVectors(normalCameraPos, topCameraPos, ease);
      const currentLook = new THREE.Vector3().lerpVectors(normalLookTarget, topLookTarget, ease);
      state.camera.lookAt(currentLook);
    }
    // --- INTRO ZOOM-IN ANIMATION ---
    else if (rawTime < introDuration) {
      const progress = rawTime / introDuration;
      const ease = progress * progress * (3 - 2 * progress);
      
      // Adjusted global camera to center the lowpoly_city map
      const globalCameraPos = new THREE.Vector3(50, 150, -40);
      const globalLookTarget = new THREE.Vector3(0, 0, 0); 
      
      state.camera.position.lerpVectors(globalCameraPos, normalCameraPos, ease);
      const currentLook = new THREE.Vector3().lerpVectors(globalLookTarget, normalLookTarget, ease);
      state.camera.lookAt(currentLook);
    } else {
      state.camera.position.copy(normalCameraPos);
      state.camera.lookAt(normalLookTarget);
    }
  });

  return (
    <group>
      {/* 3D Environment Map */}
      <Suspense fallback={null}>
        <MapModel />
      </Suspense>

      {/* Wrapper group */}
      <group ref={carWrapperRef}>
        <Suspense fallback={<group><mesh><boxGeometry args={[1, 1, 2]}/><meshStandardMaterial color="purple"/></mesh></group>}>
            <CarModel />
        </Suspense>
      </group>

      {/* --- 3D Checkpoints --- */}
      {checkpoints.map((checkpoint) => (
        <CheckpointCard key={checkpoint.id} position={checkpoint.pinPosition} />
      ))}
    </group>
  );
}

export default function App() {
  const [activeCheckpointId, setActiveCheckpointId] = useState(null);

  const forwardWheelToScene = (event) => {
    const scrollArea = document.getElementById("r3f-scroll-area");
    if (!scrollArea) return;
    event.preventDefault();
    scrollArea.scrollTop += event.deltaY;
  };

  // Ordered by travel progression (new reversed route): low time -> high time.
  const checkpoints = [
    {
      id: "about",
      title: "About Me",
      sections: [
        { subtitle: "Name", text: "Gorgan Alexandru-Răzvan", image: "/img/CXC_1707.jpg", details: "Passionate about full-stack engineering, AI-enabled apps, and practical systems." },
        { subtitle: "Education", text: "Computer Science student (German section)\nBabeș-Bolyai University, 3rd year.", details: "" },
        { subtitle: "Focus", text: "Working on robust backends, modern frontends, and AI pipelines.", image: "/img/portofolio.png", details: "" }
      ],
      links: [
        { label: "Portfolio", href: "https://alexgo07.github.io/portofolio/" },
        { label: "GitHub", href: "https://github.com/AlexGo07" },
        { label: "LinkedIn", href: "https://linkedin.com/in/alex-gorgan-6738712bb/" }
      ],
      pinPosition: [50, 10, 10],
      time: 0.24,
      target: new THREE.Vector3(50, 24, 10),
      camPos: new THREE.Vector3(62, 26, 22),
      duration: 0.04
    },
    {
      id: "projects",
      title: "Personal Projects",
      sections: [
        { 
          subtitle: "AI-Powered Collaborative Workspace", 
          text: "(Trello Clone)",
          image: "/img/sgbd.png",
          details: "Co-developed a task management app featuring intelligent data retrieval and semantic search, utilizing Chroma DB to handle complex context and unstructured data."
        },
        { 
          subtitle: "HostMe", 
          text: "(Student Housing Mobile App)",
          details: "Built a cross-platform mobile application using Flutter to streamline student accommodations. Integrated Google Cloud Platform (GCP) services, including Google Maps API for location tracking and Google Sign-In for secure authentication."
        },
        { 
          subtitle: "Droply", 
          text: "(Delivery Management System)", 
          image: "/img/delivery-service.png",
          details: "Co-developed an Object-Oriented Java MVC application to manage logistics, track deliveries, and streamline courier operations.",
          cardLinks: [{ label: "View Project", href: "https://github.com/AlexGo07/" }] 
        },
        { 
          subtitle: "Gamified Learning Workspace", 
          text: "(Startup)",
          details: "Currently building an interactive educational platform featuring a custom reward system designed to drive user engagement and gamify the learning experience."
        },
        { 
          subtitle: "Bachelor's Thesis", 
          text: "AI Fake News Detector",
          image: "/img/web-scrapper.png",
          details: "Actively developing an NLP-based machine learning model (using Python) to detect and classify fake news within Romanian online content."
        },
        { 
          subtitle: "Multiplayer Battleship Game", 
          text: "Real-time client-server desktop game", 
          image: "/img/battleship.png",
          details: "Developed a real-time client-server desktop game utilizing TCP Sockets for network communication. Implemented cross-language compatibility using Java, Python, and C#.",
          cardLinks: [{ label: "Source Code", href: "https://github.com/AlexGo07/BattleshipWithTcp" }] 
        },
        { 
          subtitle: "Delivery Service (OOP)", 
          text: "Java / Gradle / Postgres", 
          image: "/img/delivery-service1.png",
          details: "Worked with a collegue on developing an application for a delivery company, that is similar to Bolt/Uber. Anyone can join and deliver packages as a side-job.",
          cardLinks: [{ label: "Source Code", href: "https://github.com/robertemi/Delivery_Service2" }] 
        },
        { 
          subtitle: "Database Handling System", 
          text: "Frontend in Tkinter handling Postgres/MySQL.", 
          image: "/img/sgbd.png",
          details: "An application with frontend in Tkinter that tests different problems and concurrency handling scenarios in Databases using Python and Java.",
          cardLinks: [{ label: "Source Code", href: "https://github.com/AlexGo07/SGBD-Delivery-Service" }] 
        },
        { 
          subtitle: "Web-scraper", 
          text: "Flight scraping sorting app in Python.", 
          image: "/img/web-scrapper.png",
          details: "A scraping app for flights with dynamic sorting capabilities utilizing BeautifulSoup4 and Selenium.",
          cardLinks: [{ label: "Source Code", href: "https://github.com/AlexGo07/FlightScrapper" }] 
        },
        { 
          subtitle: "Car Rental", 
          text: "First team project utilizing OOP concepts in C++.", 
          image: "/img/CarRental1.png",
          details: "Worked with colleagues to develop core architecture and flows using Git for version control and C++ for logic.",
          cardLinks: [{ label: "Source Code", href: "https://github.com/dariuscruceru21/CarSharingFInal" }] 
        }
      ],
      links: [
        { label: "GitHub Profile", href: "https://github.com/AlexGo07" }
      ],
      pinPosition: [24, 7, 29],
      time: 0.38,
      target: new THREE.Vector3(24, 21, 29),
      camPos: new THREE.Vector3(36, 23, 41),
      duration: 0.04
    },
    {
      id: "experience",
      title: "Work Experience",
      sections: [
        { 
          subtitle: "Working Student NTT DATA Romania", 
          text: "24/11/2025 - 31/03/2026",
          details: "• AMO (Application management Outsourcing) - First Tier Services\n• Developed a small Spring Boot Application\n• Introduction to Mainframe and working on the Mainframe" 
        },
        { 
          subtitle: "fme SRL Software Development Intern", 
          text: "14/07/2025 - 14/10/2025",
          details: "• Full-Stack Development: Developed a task management app and a file importer (with versioning and threading via Nuxeo API) using React (TypeScript/Vite.js) and Java Spring Boot.\n• Agile & Deployment: Leveraged AI tools for rapid debugging and deployed containerized solutions using Docker and Tomcat within an Agile workflow." 
        },
        { 
          subtitle: "Hackathon Participant - Web Application Development MHP Consulting Romania", 
          text: "09/06/2024 - 13/06/2024",
          details: "• Project: A web application designed as a reservation tool for company employees, incorporating AI features to predict desk and room occupancy rates based on time.\n• Role: Collaborated as part of a team as Full-Stack Developer\n• Technologies Used: HTML, JavaScript, CSS, MongoDB, Scikit-learn, logical AI models.\n• Skills Gained: Gained hands-on experience with web frameworks, databases, AI libraries, and front-end programming languages." 
        }
      ],
      links: [
        { label: "LinkedIn", href: "https://linkedin.com/in/alex-gorgan-6738712bb/" }
      ],
      pinPosition: [2, 8, 18],
      time: 0.5,
      target: new THREE.Vector3(2, 24, 18),
      camPos: new THREE.Vector3(12, 24, 26),
      duration: 0.04
    },
    {
      id: "courses",
      title: "Education & Courses",
      sections: [
        { subtitle: "Highschool", text: "Liceul Teoretic \"Avram-Iancu\"", details: "• Mathematics and Informatics" },
        { subtitle: "Bachelor", text: "“Babes Bolyai” University", details: "• Computer Science in German 3rd year" },
        { subtitle: "Courses & Certifications", text: "HarvardX, Cisco, Google, AWS, LinuxFoundationX", details: "• CS50P-HarvardX\n• Cisco Networking Academy\n• CS50AI-HarvardX\n• CS50Web-HarvardX\n• CS50 Cyber Security-HarvardX\n• Google AI for JavaScript developers\n• AWS-Cloud Technical Essentials\n• Introduction to Node.js-LinuxFoundationX\n• Java Spring Boot Certification - NTT DATA" }
      ],
      links: [
        { label: "CS50AI", href: "https://cs50.harvard.edu/ai/2024/" },
        { label: "CS50P", href: "https://cs50.harvard.edu/python/2022/" },
        { label: "CS50 Web", href: "https://cs50.harvard.edu/web/2020/" },
        { label: "Cisco Networking", href: "https://www.netacad.com/courses/networking-basics?courseLang=en-US" }
      ],
      pinPosition: [-18, 5, -2],
      time: 0.62,
      target: new THREE.Vector3(-18, 19, -2),
      camPos: new THREE.Vector3(-6, 21, 10),
      duration: 0.04
    },
    {
      id: "skills",
      title: "Digital Skills",
      sections: [
        { subtitle: "Programming", text: "Java, Python, C++, JavaScript, C#, C, Shell." },
        { subtitle: "Web Development", text: "HTML, CSS, React, Node.js, Django." },
        { subtitle: "Databases", text: "SQL (PostgreSQL, MS-SQL), MongoDB, ChromaDB." },
        { subtitle: "AI/ML", text: "TensorFlow, Scikit-learn, Keras, local LLM pipelines, RAG architectures." },
        { subtitle: "Tools", text: "Docker, Git, Linux, Gradle, Maven, CI/CD, Cisco Packet Tracer." }
      ],
      links: [
        { label: "GitHub Profile", href: "https://github.com/AlexGo07" },
        { label: "Download CV", href: "/CV.pdf" }
      ],
      pinPosition: [20, 8, -6],
      time: 0.76,
      target: new THREE.Vector3(20, 22, -6),
      camPos: new THREE.Vector3(32, 24, 6),
      duration: 0.04
    },
    {
      id: "contact",
      title: "Contact",
      sections: [
        { subtitle: "Email", text: "gorganalexandru3@gmail.com" },
        { subtitle: "Phone", text: "+40771353438" },
        { subtitle: "Languages", text: "English C1, German B2, French A2." },
        { subtitle: "Availability", text: "Open to internships, student roles, and collaboration opportunities." }
      ],
      links: [
        { label: "Portfolio", href: "https://alexgo07.github.io/portofolio/" },
        { label: "LinkedIn", href: "https://linkedin.com/in/alex-gorgan-6738712bb/" },
        { label: "Download CV", href: "/CV.pdf" }
      ],
      pinPosition: [44, 9, 24],
      time: 0.88,
      target: new THREE.Vector3(44, 23, 24),
      camPos: new THREE.Vector3(52, 23, 34),
      duration: 0.04
    }
  ];

  const activeCheckpoint = checkpoints.find((c) => c.id === activeCheckpointId) || null;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#87CEEB", position: "relative" }}>
      <Canvas>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <Environment preset="city" />
        <ScrollControls pages={6} damping={0.2}>
          <Experience checkpoints={checkpoints} onActiveCheckpointChange={setActiveCheckpointId} />
        </ScrollControls>
      </Canvas>

      {activeCheckpoint && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(16, 24, 40, 0.72)",
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              width: "min(1000px, 94vw)",
              height: "fit-content",
              maxHeight: "95vh",
              overflow: "hidden", // Completely preventing scroll
              background: "#ffffff",
              borderRadius: "22px",
              border: "3px solid #3b82f6",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
              padding: "24px 28px",
              pointerEvents: "auto",
              display: "flex",
              flexDirection: "column"
            }}
            onWheel={forwardWheelToScene}
          >
            <h2 style={{ margin: 0, marginBottom: 16, fontSize: "1.8rem", color: "#1e3a8a", textAlign: "center", fontWeight: 800, borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
              {activeCheckpoint.title}
            </h2>

            <div style={{ flex: 1, overflow: "hidden" }}>
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                {activeCheckpoint.sections && activeCheckpoint.sections.map((sec, idx) => (
                  <ExpandableCard key={idx} sec={sec} />
                ))}
              </div>
            </div>

            {activeCheckpoint.links && activeCheckpoint.links.length > 0 && (
              <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {activeCheckpoint.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      background: "#2563eb",
                      color: "#fff",
                      padding: "10px 16px",
                      borderRadius: 10,
                      fontWeight: 600
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            <p style={{ marginTop: 22, marginBottom: 0, textAlign: "center", color: "#6b7280" }}>
              Scroll to continue
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

