/* Shared catalogue data — extracted so the storefront has no circular dep on app/page. */
const PH = (prompt, seed, model = "flux-realism") =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=700&height=500&nologo=true&seed=${seed}&model=${model}&enhance=true`;
const R = (p, s) => PH(p, s, "flux-realism");
const F = (p, s) => PH(p, s, "flux");

const AMZ = (isbn10) => `https://images-na.ssl-images-amazon.com/images/P/${isbn10}.jpg`;
// Open Library fallback (CC licensed ISBN covers)
const OL = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
// Google Books official preview thumbnails
const GB = (id) => `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=3`;
// AI fallback
const BK = (title, seed) => R(`${title} medical textbook cover, professional academic book, white background, studio photography, no people`, seed);

export const BOOK_ITEMS = [
  // 1st Year
  { id:"b-1",  type:"book", year:"1st Year", subject:"Anatomy",
    name:"Anatomy & Physiology in Health and Illness", tagline:"Ross & Wilson · Elsevier",
    price:799, originalPrice:949, badge:"1ST YEAR", stock:20,
    desc:"The classic Ross & Wilson text covering human anatomy and physiology with clear diagrams and clinical applications. Widely used in BPT first year for understanding the structural and functional basis of the human body. Elsevier edition with full-colour illustrations, case studies, and self-test questions aligned to BPT curriculum.",
    images:[AMZ("0323834604"), OL("9780702078491"), GB("8sCOWgEACAAJ")] },

  { id:"b-2",  type:"book", year:"1st Year", subject:"Anatomy",
    name:"Gray's Anatomy", tagline:"Gray H. · Churchill Livingstone",
    price:1249, originalPrice:1499, badge:"1ST YEAR", stock:15,
    desc:"The definitive anatomical reference, Gray's Anatomy is the gold standard for medical and physiotherapy students. The Churchill Livingstone edition provides comprehensive coverage of gross anatomy with detailed illustrations, clinical boxes, and dissection guides. Essential for BPT first-year anatomy lab preparation and long-term clinical reference.",
    images:[AMZ("0443069522"), OL("9780702052309"), GB("CxVqAAAAMAAJ")] },

  { id:"b-3",  type:"book", year:"1st Year", subject:"Physiology",
    name:"Textbook of Medical Physiology", tagline:"Guyton A.C. & Hall J.E. · Elsevier",
    price:849, originalPrice:1099, badge:"1ST YEAR", stock:18,
    desc:"Guyton and Hall's Textbook of Medical Physiology is the most widely used physiology textbook in medical and physiotherapy education. Covers all major organ systems with clinical correlations, updated research, and clear mechanistic explanations. The Elsevier edition includes full-colour illustrations and a comprehensive index — essential for BPT first and second year physiology.",
    images:[AMZ("0323597122"), OL("9780323597128"), GB("wqkVAAAAYAAJ")] },

  { id:"b-4",  type:"book", year:"1st Year", subject:"Physiology",
    name:"Essentials of Medical Physiology", tagline:"Sembulingam K. · Jaypee",
    price:449, originalPrice:549, badge:"1ST YEAR", stock:22,
    desc:"Sembulingam's Essentials of Medical Physiology is a concise, India-focused physiology text popular among BPT students for its straightforward explanations and exam-oriented approach. The Jaypee edition covers all major physiological systems with relevant clinical applications, making it an ideal companion to Guyton or as a standalone revision resource.",
    images:[AMZ("9352706927"), OL("9789386150950"), GB("YYBhDwAAQBAJ")] },

  { id:"b-5",  type:"book", year:"1st Year", subject:"Psychology",
    name:"General Psychology", tagline:"Mangal S.K.",
    price:279, originalPrice:349, badge:"1ST YEAR", stock:25,
    desc:"Mangal's General Psychology is the prescribed psychology text for BPT first year, covering fundamental psychological concepts including behaviour, perception, learning, memory, motivation, emotion, and personality. Written in simple language with Indian examples, it helps physiotherapy students understand the psychosocial dimensions of patient care and therapeutic relationships.",
    images:[AMZ("9386245760"), OL("9788121909310")] },

  { id:"b-6",  type:"book", year:"1st Year", subject:"Sociology",
    name:"An Introduction to Sociology", tagline:"Sachdeva D.R. & Bhushan V.",
    price:229, originalPrice:299, badge:"1ST YEAR", stock:25,
    desc:"Sachdeva and Bhushan's Introduction to Sociology covers the core sociological concepts required in the BPT first-year curriculum: social structure, culture, family, community health, and social determinants of disease. Helps physiotherapy students understand patients in their social context and develop community-oriented clinical practice.",
    images:["https://www.kitabmahalpublishers.com/uploads/product_image/product_9788122507324_1.jpg", OL("9788131512340")] },

  // 2nd Year
  { id:"b-7",  type:"book", year:"2nd Year", subject:"Pathology & Microbiology",
    name:"Textbook of Pathology", tagline:"Mohan H. · Jaypee",
    price:649, originalPrice:799, badge:"2ND YEAR", stock:18,
    desc:"Mohan's Textbook of Pathology is the standard pathology reference for BPT second year, providing a comprehensive understanding of disease processes, cellular pathology, inflammation, neoplasia, and organ-specific diseases. The Jaypee edition is widely available in India and includes full-colour histopathology images, relevant clinical correlations, and exam-oriented summaries.",
    images:[AMZ("8180613682"), OL("9789386150394"), GB("F-nRsgEACAAJ")] },

  { id:"b-8",  type:"book", year:"2nd Year", subject:"Exercise Therapy",
    name:"Principles of Exercise Therapy", tagline:"Gardiner D. · CBS Publishers",
    price:449, originalPrice:549, badge:"2ND YEAR", stock:20,
    desc:"Gardiner's Principles of Exercise Therapy is the core exercise therapy textbook for BPT second year, covering the theoretical and practical foundations of therapeutic exercise including active, passive, resisted, and stretching exercises. Includes principles of strengthening, endurance training, and functional movement — directly applicable to BPT practical lab work.",
    images:[AMZ("8123908938"), OL("9788123910765")] },

  { id:"b-9",  type:"book", year:"2nd Year", subject:"Biomechanics",
    name:"Joint Structure and Function", tagline:"Norkin C.C. & Levangie P.K. · F.A. Davis",
    price:749, originalPrice:899, badge:"2ND YEAR", stock:15,
    desc:"Norkin and Levangie's Joint Structure and Function is the definitive biomechanics reference for physiotherapy students, covering articular structure, kinematics, and kinetics of all major joints. Published by F.A. Davis, it bridges anatomy and clinical physiotherapy practice, making it essential for understanding normal and pathological movement in BPT second year.",
    images:[AMZ("0803607105"), OL("9780803623620"), GB("ym7HPQAACAAJ")] },

  { id:"b-10", type:"book", year:"2nd Year", subject:"Pharmacology",
    name:"Essentials of Medical Pharmacology", tagline:"Tripathi K.D. · Jaypee",
    price:549, originalPrice:699, badge:"2ND YEAR", stock:20,
    desc:"Tripathi's Essentials of Medical Pharmacology is the standard pharmacology text used across Indian medical and allied health curricula. Covers all major drug classes with mechanisms of action, indications, contraindications, and clinical uses relevant to physiotherapy practice — including NSAIDs, muscle relaxants, analgesics, and drugs used in neurological and cardiovascular conditions.",
    images:[AMZ("9356964327"), OL("9789389587166"), GB("2gP1DwAAQBAJ")] },

  // 3rd Year
  { id:"b-11", type:"book", year:"3rd Year", subject:"Electrotherapy",
    name:"Electrotherapy Explained: Principles and Practice", tagline:"Robertson V. · Elsevier",
    price:649, originalPrice:799, badge:"3RD YEAR", stock:15,
    desc:"Robertson's Electrotherapy Explained is the comprehensive reference for electrotherapy in BPT third year, covering TENS, ultrasound, IFT, shortwave diathermy, LASER, and neuromuscular electrical stimulation. The Elsevier edition includes physiological rationale, evidence-based clinical applications, dosage guidelines, contraindications, and safety protocols — aligned directly to the BPT electrotherapy curriculum.",
    images:[AMZ("0750688432"), OL("9780750688147"), GB("3RcuI8nfJFEC")] },

  { id:"b-12", type:"book", year:"3rd Year", subject:"General Medicine & Surgery",
    name:"Principles and Practice of Medicine", tagline:"Davidson's · Elsevier",
    price:999, originalPrice:1299, badge:"3RD YEAR", stock:12,
    desc:"Davidson's Principles and Practice of Medicine is the gold-standard internal medicine reference, widely used by physiotherapy students in their third year clinical postings. Covers major medical conditions, their pathophysiology, diagnosis, and management — providing physiotherapy students the medical background needed for evidence-based clinical reasoning in all specialty areas.",
    images:[AMZ("0702083488"), OL("9780702070273"), GB("9x5FEAAAQBAJ")] },

  { id:"b-13", type:"book", year:"3rd Year", subject:"Orthopaedics",
    name:"Essential Orthopaedics", tagline:"Maheshwari J. · Jaypee",
    price:549, originalPrice:699, badge:"3RD YEAR", stock:18,
    desc:"Maheshwari's Essential Orthopaedics is the primary orthopaedics reference for BPT third year, covering fractures, dislocations, joint diseases, spinal conditions, and orthopaedic procedures from a clinical perspective. The Jaypee edition is India-specific, with conditions and clinical cases relevant to the Indian population and hospital setting, making it ideal for ward postings.",
    images:[AMZ("9372026654"), OL("9789354651403"), GB("rOtFDwAAQBAJ")] },

  { id:"b-14", type:"book", year:"3rd Year", subject:"Neurology",
    name:"Neurological Examination in Clinical Practice", tagline:"Bickerstaff E.R.",
    price:449, originalPrice:549, badge:"3RD YEAR", stock:15,
    desc:"Bickerstaff's Neurological Examination in Clinical Practice is the clinical neurology examination guide used by BPT students in their third-year neurology postings. Covers systematic neurological assessment — cranial nerves, motor system, sensory system, reflexes, coordination, and cerebellar function — with practical guidance for examination technique and clinical interpretation.",
    images:[AMZ("086542909X"), OL("9780632013173"), GB("9jtqAAAAMAAJ")] },

  // Final Year
  { id:"b-15", type:"book", year:"Final Year", subject:"Physiotherapy in Orthopaedics",
    name:"Clinical Orthopaedic Rehabilitation", tagline:"Brotzman S.B. · Elsevier",
    price:799, originalPrice:999, badge:"FINAL YEAR", stock:12,
    desc:"Brotzman's Clinical Orthopaedic Rehabilitation is the definitive rehabilitation protocols reference for final-year BPT students and clinical physiotherapists. Provides evidence-based, protocol-driven rehabilitation programs for all major orthopaedic conditions — ACL reconstruction, rotator cuff repair, hip and knee arthroplasty, and sports injuries — aligned to current clinical practice standards.",
    images:[AMZ("0323393705"), OL("9780323393706"), GB("bkXfBQAAQBAJ")] },

  { id:"b-16", type:"book", year:"Final Year", subject:"Physiotherapy in Neurology",
    name:"Neurological Rehabilitation", tagline:"Umphred D.A. · Mosby",
    price:849, originalPrice:1049, badge:"FINAL YEAR", stock:10,
    desc:"Umphred's Neurological Rehabilitation is the comprehensive neurorehabilitation reference for final-year BPT students, covering neuroplasticity, motor control theories, and rehabilitation approaches for stroke, traumatic brain injury, spinal cord injury, Parkinson's disease, multiple sclerosis, and cerebral palsy. The Mosby edition is internationally recognised and includes evidence-based intervention frameworks.",
    images:[AMZ("032307586X"), OL("9780323172271"), GB("tvMJAAAAQBAJ")] },

  { id:"b-17", type:"book", year:"Final Year", subject:"Cardio-Respiratory Physiotherapy",
    name:"Physiotherapy for Respiratory and Cardiac Problems", tagline:"Pryor J.A. & Prasad S.A.",
    price:699, originalPrice:849, badge:"FINAL YEAR", stock:12,
    desc:"Pryor and Prasad's Physiotherapy for Respiratory and Cardiac Problems is the key cardiopulmonary physiotherapy reference for BPT final year, covering lung volumes, airway clearance techniques, breathing exercises, cardiac rehabilitation, and physiotherapy management of COPD, asthma, pneumonia, and post-cardiac surgery conditions. Includes evidence-based clinical reasoning frameworks.",
    images:[AMZ("813123634X"), OL("9780443073144"), GB("KBYDAAAACAAJ")] },

  { id:"b-18", type:"book", year:"Final Year", subject:"Therapeutic Exercise",
    name:"Therapeutic Exercise: Foundations and Techniques", tagline:"Kisner C. & Colby L. · F.A. Davis",
    price:799, originalPrice:999, badge:"FINAL YEAR", stock:10,
    desc:"Kisner and Colby's Therapeutic Exercise is the most comprehensive and widely used therapeutic exercise textbook in physiotherapy education. The F.A. Davis edition covers exercise principles, stretching, strengthening, aerobic conditioning, and condition-specific exercise programs for orthopaedic, neurological, and cardiopulmonary conditions — a cornerstone reference for final-year BPT students and practising physiotherapists.",
    images:[AMZ("080362574X"), OL("9780803658509"), GB("9GxHAAAAYAAJ")] },

  { id:"b-19", type:"book", year:"Final Year", subject:"Rehabilitation & Community Medicine",
    name:"Preventive and Social Medicine", tagline:"Park K.",
    price:449, originalPrice:549, badge:"FINAL YEAR", stock:20,
    desc:"Park's Preventive and Social Medicine is the standard PSM and community medicine reference for BPT final year, covering epidemiology, public health, nutrition, environmental health, health statistics, and community-based rehabilitation. Provides physiotherapy students with the public health framework needed for community outreach, disability management, and preventive physiotherapy programs.",
    images:["https://prithvibooks.com/wp-content/uploads/2025/01/Parks_Textbook_of_Preventive_and_Social_Medicine_28th_Edition_2025.png", OL("9789389863741"), GB("4D_CzgEACAAJ")] },
];
