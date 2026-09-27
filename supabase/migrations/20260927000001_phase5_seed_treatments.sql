-- ============================================================================
-- AARUNYA PHASE 5 SEED: Medical Treatments Dataset
-- Migration: 20260927000001_phase5_seed_treatments.sql
-- ============================================================================

INSERT INTO public.treatments (
  name,
  slug,
  specialty,
  category,
  overview,
  description,
  indications,
  process,
  recovery_info,
  estimated_duration,
  faqs,
  image_url,
  is_published
)
VALUES
  (
    'Coronary Artery Bypass Graft (CABG)',
    'coronary-artery-bypass-graft-cabg',
    'Cardiology',
    'Adult Cardiac Surgery',
    'Coronary Artery Bypass Graft (CABG) is an advanced open-heart surgical intervention used to restore healthy myocardial blood flow in patients suffering from severe multivessel coronary artery disease.',
    'Performed by premier cardiothoracic surgical teams across India using modern off-pump (beating heart) or minimally invasive endoscopic vessel harvesting (EVH) techniques, drastically lowering intraoperative risk and surgical trauma.',
    E'• Severe triple vessel coronary disease (CAD) confirmed via coronary angiogram\n• Significant stenosis (>50%) of the Left Main Coronary Artery\n• Refractory angina pectoris unresponsive to aggressive medical therapy and PCI stenting\n• Diabetic coronary disease with multi-vessel diffuse blockages',
    E'1. Comprehensive Pre-Operative Assessment: 2D-Echocardiography, coronary angiography, carotid Doppler, and pulmonary function testing.\n2. Conduit Harvesting: Endoscopic harvesting of the internal mammary artery (LIMA) and great saphenous vein.\n3. Surgical Bypass Grafting: Precision microsurgical anastomosis of vascular conduits past arterial blockages on a beating heart (off-pump CABG).\n4. Cardiac Intensive Care Stabilization: 48 hours of continuous hemodynamic monitoring in a specialized CCU.',
    E'• Hospital Stay: 6 to 8 days total (including 2 days in cardiac ICU).\n• Step-down Ward: Mobilization, spirometry breathing therapy, and early ambulation from post-op day 3.\n• International Flight Clearance: Fit-to-fly clearance provided 14–21 days after procedure following final 2D-Echo review.\n• Full Functional Recovery: 6–8 weeks with structured outpatient cardiac rehab guidelines.',
    '7–9 Days in Hospital / 14 Days in India',
    '[
      {"question": "What is the difference between beating-heart (off-pump) and conventional CABG?", "answer": "In off-pump (beating-heart) CABG, the cardiac surgeon operates while your heart continues to pump blood, using advanced tissue stabilizers without needing the heart-lung bypass machine. This significantly reduces inflammation, bleeding risks, and stroke rates, especially in elderly or high-risk patients."},
      {"question": "How soon can international patients fly home after heart bypass surgery?", "answer": "Most international patients are medically cleared for long-haul air travel 14 to 21 days following CABG, after comprehensive wound inspection, follow-up echocardiogram, and issuance of fit-to-fly medical documentation."},
      {"question": "What is the expected long-term patency of arterial grafts used in India?", "answer": "The Left Internal Mammary Artery (LIMA) grafted to the Left Anterior Descending (LAD) artery demonstrates exceptional long-term survival, with patency rates exceeding 90–95% at 10 to 15 years post-surgery."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Transcatheter Aortic Valve Implantation (TAVI / TAVR)',
    'transcatheter-aortic-valve-implantation-tavi',
    'Cardiology',
    'Interventional Cardiology',
    'Transcatheter Aortic Valve Implantation (TAVI/TAVR) is a minimally invasive percutaneous cardiac procedure replacing a diseased, calcified aortic valve without opening the chest or placing the patient on cardiopulmonary bypass.',
    'A transformative procedure for elderly patients or individuals with high surgical risk who cannot undergo standard open-heart sternotomy. Performed in state-of-the-art biplane cardiac catheterization labs using balloon-expandable or self-expanding bioprosthetic valves.',
    E'• Severe symptomatic native aortic stenosis (valve area < 1.0 cm²)\n• Moderate-to-high surgical risk as evaluated by STS / EuroSCORE II predictive risk algorithms\n• Degenerated previously implanted surgical bioprosthetic aortic valve (Valve-in-Valve TAVI)\n• Patient preference for minimally invasive catheter-based intervention without general sternotomy',
    E'1. Transfemoral Catheter Delivery: Introducer sheath placed into the common femoral artery under fluoroscopic and transesophageal echocardiography (TEE) guidance.\n2. Balloon Valvuloplasty: Dilatation of the stenotic native valve calcification.\n3. Valve Deployment: Precise positioning and expansion of the bioprosthetic heart valve across the native aortic annulus.\n4. Hemodynamic Confirmation: Immediate invasive gradient measurement and aortogram verifying minimal paravalvular regurgitation.',
    E'• Hospital Stay: 3 to 4 days total (including 24 hours in coronary care observation).\n• Immediate Ambulation: Patients are safely walking within 24 hours post-implantation.\n• International Flight Clearance: Fit-to-fly issued within 7–10 days post-procedure.\n• Rapid Recovery: Near-immediate relief of shortness of breath and angina, with normal activities resuming in 1–2 weeks.',
    '3–4 Days in Hospital / 7–10 Days in India',
    '[
      {"question": "Is general anesthesia mandatory for TAVI?", "answer": "In most modern Indian cardiac centers of excellence, TAVI is performed under conscious sedation (local anesthesia with mild sedation) rather than full general endotracheal anesthesia, expediting recovery and discharge."},
      {"question": "How durable are transcatheter bioprosthetic heart valves?", "answer": "Contemporary clinical registry data demonstrates robust hemodynamic performance and durability comparable to surgical bioprostheses for over 8–10 years."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Robotic Total Knee Replacement',
    'robotic-total-knee-replacement',
    'Orthopedics',
    'Joint Reconstruction',
    'Robotic-assisted Total Knee Arthroplasty (TKA) utilizes autonomous robotic arms (Mako, Rosa, or Cuvis) and CT-based 3D computer navigation to replace degenerated knee cartilage with sub-millimeter prosthetic precision.',
    'Advanced robotic instrumentation provides real-time ligament balance assessment and custom cuts, maximizing implant longevity, reducing soft-tissue trauma, and allowing patients to walk hours after surgery.',
    E'• Severe end-stage osteoarthritis or rheumatoid arthritis of the knee joint with persistent disability\n• Failure of non-surgical conservative treatments (physiotherapy, hyaluronic acid, intra-articular injections)\n• Significant varus (bow-legged) or valgus (knock-kneed) angular joint deformities\n• Chronic nocturnal knee pain severely restricting basic mobility and quality of life',
    E'1. 3D CT Virtual Planning: Pre-operative pelvic-to-ankle CT scan converted into a patient-specific 3D anatomical bone model.\n2. Intraoperative Kinematic Balancing: Robotic sensors evaluate natural ligament tension across full extension and flexion arcs.\n3. Robotic Bone Preparation: Robotic arm guides bone resurfacing with high accuracy, protecting collateral ligaments.\n4. Implant Fixation & Verification: Premium FDA/CE-approved cobalt-chromium or titanium components cemented with bone cement.',
    E'• Hospital Stay: 4 to 5 days in a private orthopedics suite.\n• Same-Day Ambulation: Physical therapists assist standing and walking with a walker within 6–12 hours post-surgery.\n• Intensive Physiotherapy: 5–7 days of daily in-hospital gait and range-of-motion training.\n• International Flight Clearance: Medically cleared to fly 10–14 days post-op with deep vein thrombosis (DVT) prophylaxis.',
    '4–5 Days in Hospital / 12–14 Days in India',
    '[
      {"question": "Does the robot perform the knee surgery automatically?", "answer": "No. The orthopedic surgeon maintains total tactile and visual control at all times. The robotic arm provides active haptic boundary constraints and ultra-precise guidance to prevent deviations from the pre-planned bone resection plane."},
      {"question": "How long will my robotic knee replacement last?", "answer": "With precise robotic alignment and modern cross-linked polyethylene inserts, contemporary total knee implants are clinically documented to survive 20 to 25+ years in over 90% of recipients."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Total Hip Arthroplasty (Anterior / Posterior Approach)',
    'total-hip-arthroplasty',
    'Orthopedics',
    'Joint Replacement',
    'Total Hip Replacement (Arthroplasty) surgically replaces arthritic or damaged femoral head and acetabulum components with biocompatible ceramic-on-polyethylene or ceramic-on-ceramic prosthetic bearing surfaces.',
    'Indian orthopedic centers specialize in direct anterior approach (muscle-sparing) and dual-mobility articulations that eliminate post-operative hip dislocation precautions and accelerate unassisted walking.',
    E'• Avascular Necrosis (AVN) of the femoral head caused by steroid use, trauma, or sickle cell disease\n• End-stage secondary osteoarthritis, ankylosing spondylitis, or dysplastic hip pathology\n• Femoral neck fractures in active adults requiring joint reconstruction\n• Intractable groin pain radiating down the anterior thigh with severe flexion contracture',
    E'1. Pre-Op Digital Templating: Digital templating to determine optimal femoral neck offset, leg length, and acetabular version.\n2. Surgical Exposure: Muscle-sparing anterior incision or posterolateral approach preserving abductor muscle integrity.\n3. Acetabular Reaming & Cup Placement: Press-fit porous titanium acetabular shell with ultra-high molecular weight polyethylene liner.\n4. Femoral Broaching & Head Reductions: Tapered femoral stem insertion with delta-ceramic ball head reduction and stability testing.',
    E'• Hospital Stay: 4 to 5 days.\n• Weight-Bearing: Full weight-bearing allowed on postoperative day 1 using elbow crutches or walker.\n• Leg Length Restoration: Symmetry verified via post-op standing digital pelvis X-rays.\n• Flight Clearance: 12–14 days post-op with compression stockings and low-molecular-weight heparin.',
    '4–5 Days in Hospital / 12–14 Days in India',
    '[
      {"question": "What is the advantage of Ceramic-on-Ceramic bearing surfaces?", "answer": "Delta ceramic bearing couples produce near-zero wear debris, virtually eliminating osteolysis (bone loss) and significantly lowering the lifetime probability of revision surgery in young, active international patients."},
      {"question": "Can I sit cross-legged or use Indian toilets after hip replacement?", "answer": "With contemporary large-diameter ceramic femoral heads or dual-mobility designs, high ranges of flexion are safely achievable, though heavy high-impact contact sports are generally discouraged."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'CyberKnife Robotic Radiosurgery',
    'cyberknife-robotic-radiosurgery',
    'Oncology',
    'Radiation Oncology',
    'CyberKnife is a non-invasive, robotic stereotactic radiosurgery (SRS) and stereotactic body radiation therapy (SBRT) platform that delivers sub-millimeter targeted radiation to tumors throughout the body without surgical incisions.',
    'Equipped with real-time tumor tracking (Synchrony system) that dynamically synchronizes radiation beams with patient respiratory motion, shielding surrounding healthy brain, lung, or spinal tissues from collateral radiation damage.',
    E'• Intracranial brain tumors: Vestibular schwannoma / acoustic neuroma, meningiomas, brain metastases\n• Early-stage medically inoperable Non-Small Cell Lung Cancer (NSCLC)\n• Localized organ-confined prostate carcinoma\n• Inoperable liver tumors (hepatocellular carcinoma and oligometastases)\n• Complex recurrent spinal tumors adjacent to the spinal cord',
    E'1. High-Resolution Imaging & Fiducial Marking: CT simulation with MRI/PET fusion for millimeter-accurate volumetric tumor delineation.\n2. Inverse Dose Treatment Planning: Multi-criteria radiation physics calculation focusing hundreds of non-coplanar beam angles.\n3. Outpatient Radiation Delivery: Patient rests comfortably on a RoboCouch while the robotic linear accelerator targets tumor voxels.\n4. Complete Non-Invasiveness: Zero incisions, no rigid stereotactic head frames, and no general anesthesia required.',
    E'• Outpatient Treatment: 1 to 5 treatment sessions (fractions) delivered over consecutive or alternating days.\n• Zero Hospitalization: Patients return to their hotel immediately following each 30–60 minute session.\n• Side Effects: Minimal acute fatigue or transient local inflammation; no hair loss (unless treating superficial brain tumors).\n• Flight Clearance: Medically safe to fly 24–48 hours after concluding the final treatment fraction.',
    'Outpatient (1–5 Sessions) / 5–7 Days in India',
    '[
      {"question": "Is CyberKnife painful?", "answer": "No. The procedure is entirely painless, non-invasive, and silent. Patients lie comfortably on an ergonomic treatment couch while listening to music. No surgical cuts or pinning head frames are used."},
      {"question": "How many days must an international patient stay in India for CyberKnife?", "answer": "The total overseas stay is typically 5 to 7 days, allowing for pre-treatment MRI/CT simulation mapping, dosimetric plan calculation, and 1 to 5 daily delivery sessions."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Allogeneic Bone Marrow Transplant (BMT)',
    'allogeneic-bone-marrow-transplant',
    'Oncology',
    'Hematology & Stem Cell Transplantation',
    'Allogeneic Hematopoietic Stem Cell Transplantation (BMT) replaces a diseased, malignant, or failed bone marrow system with healthy matched sibling, matched unrelated donor (MUD), or haploidentical family donor stem cells.',
    'Conducted in HEPA-filtered positive-pressure BMT units with comprehensive HLA typing, flow cytometry, post-transplant cyclophosphamide (PTCy) haplo-identical protocols, and strict infection control monitoring.',
    E'• Acute Myeloid Leukemia (AML) and Acute Lymphoblastic Leukemia (ALL) in first or subsequent remission\n• Severe Aplastic Anemia refractory to immunosuppressive therapy\n• Thalassemia Major and Sickle Cell Anemia in pediatric or adolescent candidates\n• High-Risk Myelodysplastic Syndromes (MDS) and Primary Myelofibrosis',
    E'1. Donor HLA Typing & Harvesting: Full 10/10 high-resolution HLA matching or haploidentical donor mobilization using G-CSF.\n2. Conditioning Chemotherapy: High-dose preparatory chemotherapy ± total body irradiation (TBI) to eradicate diseased marrow.\n3. Stem Cell Infusion (Day 0): Painless intravenous transfusion of peripheral blood stem cells (PBSC) or bone marrow harvest.\n4. Aplasia & Engraftment Phase: Neutrophil and platelet engraftment monitoring in sterile isolation with IV antimicrobial support.',
    E'• In-Hospital Isolation Stay: 3 to 4 weeks in a laminar airflow HEPA-filtered clean room.\n• Engraftment Confirmation: Absolute neutrophil count (ANC) > 500/µL achieved between Days 14–21.\n• Outpatient Monitoring in India: 60 to 90 days of close outpatient clinic monitoring for chimerism and GVHD management.\n• Return Flight Clearance: Approximately 90–100 days post-transplantation following bone marrow biopsy confirmation.',
    '25–30 Days in Inpatient Isolation / 90 Days in India',
    '[
      {"question": "What if no full 10/10 HLA matched sibling donor exists in our family?", "answer": "Indian transplant centers are world pioneers in Haploidentical (half-matched) family donor BMT using post-transplant cyclophosphamide, allowing parents or children to serve as successful donors with excellent disease-free survival rates."},
      {"question": "How are infections prevented in the BMT clean room?", "answer": "Patients reside in positive-pressure suites with HEPA air filtration (>99.97% particulate removal), reverse osmosis water treatment, sterile dietary protocols, and continuous prophylactic antiviral, antifungal, and antibacterial regimens."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Living Donor Liver Transplantation (LDLT)',
    'living-donor-liver-transplantation',
    'Organ Transplant',
    'Hepato-Pancreato-Biliary Surgery',
    'Living Donor Liver Transplantation (LDLT) is a lifesaving surgical operation in which a portion of a healthy family donor liver (typically the right hepatic lobe) is surgically resected and transplanted into an end-stage liver failure recipient.',
    'India is an undisputed global capital for LDLT, executing over 2,500 successful liver transplants each year with >95% success rates, dual-surgeon donor/recipient synchronization, and microvascular biliary reconstruction.',
    E'• End-stage liver cirrhosis resulting from Hepatitis B/C, NASH/MASH, or alcoholic liver disease\n• Hepatocellular Carcinoma (HCC) fulfilling Milan or UCSF staging criteria\n• Acute on Chronic Liver Failure (ACLF) with decompensated ascites, encephalopathy, or hepatorenal syndrome\n• Biliary Atresia and metabolic liver diseases in pediatric patients',
    E'1. High-Resolution Donor & Recipient Evaluation: 3D CT volumetry, vascular anatomy delineation, and government authorization committee vetting.\n2. Synchronized Hepatectomy: Donor right hepatectomy (leaving ~35-40% remnant liver) while diseased recipient liver is explanted.\n3. Microvascular Anastomosis: Microsurgical reconnection of recipient portal vein, hepatic artery, hepatic veins, and biliary ducts.\n4. Dual ICU Recovery: Intensive hepatic monitoring with Doppler ultrasound tracking vascular graft patency.',
    E'• Donor Hospital Stay: 7 to 9 days; full natural liver regeneration occurs within 6–8 weeks.\n• Recipient Hospital Stay: 18 to 22 days (including 7–10 days in dedicated transplant ICU).\n• Post-Discharge Stay in India: 6 to 8 weeks for immunosuppressive drug level (tacrolimus) titration and LFT monitoring.\n• International Flight Clearance: 8–10 weeks post-transplant after complete wound healing and stable graft function.',
    '20–25 Days in Hospital / 60–75 Days in India',
    '[
      {"question": "Is living liver donation safe for the healthy donor?", "answer": "Donor safety is the paramount priority. The liver possesses unique regenerative capability, regrowing to >90% of original anatomical volume within 6 to 8 weeks. Healthy donors experience minimal long-term health impact and return to normal life within 1–2 months."},
      {"question": "What legal permissions are required for international organ transplant in India?", "answer": "Indian law (THOTA Act) requires all living donors to be genetically or legally related family members. The case undergoes comprehensive scrutiny and personal interview before an independent State Government Authorization Committee."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Deep Brain Stimulation (DBS)',
    'deep-brain-stimulation-dbs',
    'Neurology & Neurosurgery',
    'Functional Neurosurgery',
    'Deep Brain Stimulation (DBS) is a cutting-edge surgical procedure that implants medical neurostimulator leads into specific basal ganglia structures (STN or GPi) to deliver regulated electrical pulses, dramatically suppressing motor symptoms.',
    'Performed by elite functional neurosurgeons utilizing frame-based microelectrode recording (MER), intraoperative neurological testing, and directional steering leads (Boston Scientific, Medtronic, or Abbott systems).',
    E'• Advanced Parkinson’s Disease with significant motor fluctuations, "wearing-off", and levodopa-induced dyskinesia\n• Severe medically refractory Essential Tremor interfering with eating, writing, and self-care\n• Primary or secondary generalized Dystonia unresponsive to pharmacological treatment\n• Severe refractory Obsessive-Compulsive Disorder (OCD) meeting psychiatric neurosurgery criteria',
    E'1. Stereotactic Framework & MRI-CT Fusion: High-field 3T brain MRI merged with stereotactic head frame CT scans.\n2. Microelectrode Recording (MER): Intraoperative physiological mapping pinpointing exact subthalamic nucleus boundaries.\n3. Awake / Asleep Lead Implantation: Real-time clinical confirmation of tremor cessation and rigidity relief.\n4. Subclavicular IPG Placement: Subcutaneous pocket created under the collarbone to house the rechargeable pulse generator battery.',
    E'• Hospital Stay: 4 to 6 days.\n• Initial Neurostimulation Programming: Commenced 2 to 4 weeks post-surgery after temporary brain microlesion effect resolves.\n• Levodopa Medication Reduction: Most patients successfully lower Parkinsonian oral medications by 40–60%.\n• International Flight Clearance: Medically cleared for flight 10–14 days post-implantation.',
    '4–6 Days in Hospital / 14–21 Days in India',
    '[
      {"question": "Can Parkinson''s disease medications be stopped completely after DBS?", "answer": "While rarely eliminated 100%, most patients reduce their daily dopaminergic medication dosage by 40% to 60%, drastically reducing troublesome dyskinesias and motor fluctuations while significantly enhancing on-time quality of life."},
      {"question": "How long does the implanted DBS battery last?", "answer": "Modern rechargeable neurostimulators last between 15 to 25 years with weekly transcutaneous charging pads, avoiding repeated surgical procedures for battery replacements."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Minimally Invasive Spine Surgery (MISS)',
    'minimally-invasive-spine-surgery-miss',
    'Spine Surgery',
    'Orthopedic & Neuro-Spine',
    'Minimally Invasive Spine Surgery (MISS) employs tubular retractor systems, endoscopes, and intraoperative O-arm 3D fluoroscopy to treat spinal stenosis, herniated discs, and instability through tiny keyhole incisions without dissecting spinal musculature.',
    'Preserves critical paravertebral muscles and posterior spinal ligaments, reducing blood loss to negligible levels, eliminating postoperative muscle spasms, and slashing hospital convalescence times.',
    E'• Lumbar disc herniation (sciatica) refractory to 6 weeks of conservative care\n• Lumbar spinal canal stenosis with neurogenic claudication (inability to walk >100 meters without calf pain)\n• Spondylolisthesis (vertebral slippage) requiring transforaminal lumbar interbody fusion (TLIF)\n• Recurrent disc prolapse or degenerative facet hypertrophy with radiculopathy',
    E'1. Tubular Retractor Insertion: Sequential muscle-dilating tubular ports inserted under real-time fluoroscopic precision.\n2. Microscopic Nerve Decompression: High-magnification surgical microscope or spine endoscope provides pristine illumination.\n3. Fragmentectomy / Discectomy: Direct excision of the extruded disc fragment impinging upon the nerve root.\n4. Percutaneous Pedicle Screws (if fusion indicated): Titanium cannulated screws and PEEK cage placed through small stab incisions.',
    E'• Hospital Stay: 2 to 3 days.\n• Immediate Mobilization: Walking unassisted within 12–24 hours post-surgery wearing a supportive lumbar brace.\n• Minimal Wound Care: Small keyhole waterproof dressing; no stitches requiring removal (subcuticular dissolvable sutures).\n• Flight Clearance: Medically cleared for international flights 7–10 days post-procedure.',
    '2–3 Days in Hospital / 7–10 Days in India',
    '[
      {"question": "How does MISS compare to traditional open spine surgery?", "answer": "Traditional open surgery requires large incisions and stripping paraspinal muscles from the spine, causing long post-op pain. MISS dilates rather than cuts the muscle, resulting in 80% less blood loss, lower infection rates, and much faster return to normal activity."},
      {"question": "Is spine surgery safe in India?", "answer": "Leading Indian neuro-spine centers utilize continuous intraoperative neuromonitoring (IONM) to track nerve integrity in real time, virtually eliminating surgical nerve injury risks."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'In Vitro Fertilization (IVF) with ICSI',
    'ivf-with-icsi-treatment',
    'Infertility & Reproductive Medicine',
    'Assisted Reproductive Technology',
    'In Vitro Fertilization with Intracytoplasmic Sperm Injection (IVF-ICSI) is an advanced assisted reproduction method where a single healthy sperm is micro-injected directly into a mature harvested egg cell under micromanipulation.',
    'Coupled with Laser-Assisted Hatching, Preimplantation Genetic Testing for Aneuploidies (PGT-A), and blastocyst vitrification in state-of-the-art cleanroom embryology laboratories with world-class clinical pregnancy rates.',
    E'• Severe male factor infertility (oligozoospermia, asthenospermia, or azoospermia requiring TESA/PESA)\n• Tubal factor infertility: Bilateral fallopian tube blockages or previous ectopic pregnancy salpingectomy\n• Advanced maternal age (>35 years) with diminished ovarian reserve (low AMH)\n• Multiple unexplained failed IUI (intrauterine insemination) cycles or recurrent pregnancy loss',
    E'1. Controlled Ovarian Stimulation: 10–12 days of customized gonadotropin injections with transvaginal ultrasound monitoring.\n2. Ovum Pick-Up (OPU): Short 15-minute ultrasound-guided transvaginal aspiration under painless light sedation.\n3. Micro-ICSI Fertilization & Culture: Micromanipulator-assisted sperm injection and incubation to Day 5 blastocyst stage.\n4. Blastocyst Embryo Transfer: Gentle ultrasound-guided transfer of 1–2 top-grade blastocysts into the receptive endometrium.',
    E'• Clinic Visits: Outpatient procedure throughout; zero overnight hospital stay required.\n• Rest Period: 24–48 hours of relaxed movement post-embryo transfer before resuming light activities.\n• Pregnancy Blood Test: Beta-hCG blood draw conducted 12–14 days following embryo transfer.\n• International Flight Clearance: Safe for air travel 24–48 hours post-embryo transfer.',
    'Outpatient Treatment / 18–21 Days in India',
    '[
      {"question": "How long must couples stay in India for a full IVF-ICSI cycle?", "answer": "A standard fresh cycle requires approximately 18 to 21 days from day 2 of the menstrual cycle through ovarian stimulation, egg retrieval, fertilization, and embryo transfer. Alternatively, egg retrieval can be performed in trip 1 and frozen embryo transfer in trip 2."},
      {"question": "What is the clinical success rate of IVF-ICSI in India?", "answer": "For women under 35 utilizing blastocyst-stage transfers with PGT-A chromosomal screening, clinical cumulative pregnancy success rates reach 65% to 75% at premier accredited Indian fertility centers."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  specialty = EXCLUDED.specialty,
  category = EXCLUDED.category,
  overview = EXCLUDED.overview,
  description = EXCLUDED.description,
  indications = EXCLUDED.indications,
  process = EXCLUDED.process,
  recovery_info = EXCLUDED.recovery_info,
  estimated_duration = EXCLUDED.estimated_duration,
  faqs = EXCLUDED.faqs,
  image_url = EXCLUDED.image_url,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

