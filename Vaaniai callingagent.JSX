import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// 📂 REAL CALL CENTER DATASET — Integrated from uploaded files
// Sources: EN Customer Support, EN Support-Billing,
//          PL Customer Service, PL Account-Billing
// ═══════════════════════════════════════════════════════════════
const REAL_CALL_DATASET = [
  {
    id: "REAL-001", callId: "1735404531.458927",
    type: "EN Customer Support",
    language: { code:"en", name:"English", label:"English" },
    caller: "Maria", agent: "Steven",
    department: "Finance / Withdrawal Support",
    conversationType: "Customer Support Call",
    intent: "Withdrawal Assistance",
    sentiment: "cooperative",
    sentimentAnalysis: "Customer appeared cooperative and patient throughout. Followed instructions willingly and switched phones to resolve issues. Moments of confusion and frustration when technical problems occurred but remained calm.",
    urgency: "high", confidenceScore: 72, status: "escalated",
    duration: 423, isInbound: true,
    keyPoints: [
      "Agent Steven contacted Maria to assist with fund withdrawal to her bank",
      "AnyDesk used for remote assistance and screen guidance",
      "Technical issues with Pixel phone — needed to switch to Samsung",
      "Cash App verification could not be finalized due to regional restrictions",
    ],
    actionItems: [
      { task:"Agent to recheck Cash App verification process", priority:"High", due:"Immediate" },
      { task:"Maria to prepare Samsung phone for next attempt", priority:"Medium", due:"Immediate" },
      { task:"Agent to confirm if restriction is VPN or account settings", priority:"Medium", due:"24 hours" },
    ],
    customerProblems: [
      '"I don\'t know why I cannot" – unsure why Cash App verification was not working',
      '"It\'s not showing me connected" – confused about AnyDesk connection status',
      '"Even if I downloaded some app, it is like this" – frustration with technical issues',
    ],
    transcript: [
      { time:"00:00:02", speaker:"Customer", text:"Hello?" },
      { time:"00:00:04", speaker:"Agent",    text:"Hello. Am I speaking to Maria?" },
      { time:"00:00:06", speaker:"Customer", text:"Yes." },
      { time:"00:00:08", speaker:"Agent",    text:"My name is Steven. I'm calling from the finance department. You were speaking with Michael before, and your manager is Mr. Omar. Correct?" },
      { time:"00:00:20", speaker:"Agent",    text:"I was calling to help — we found a way to make a quick and easy withdrawal of your funds back to your bank. It will take about 5–10 minutes. Are you available?" },
      { time:"00:00:45", speaker:"Agent",    text:"Wonderful. Please open AnyDesk and give me your AnyDesk number." },
      { time:"00:01:11", speaker:"Customer", text:"One two seven seven five five four nine one five." },
      { time:"00:01:46", speaker:"Customer", text:"I just closed it." },
      { time:"00:02:14", speaker:"Agent",    text:"Which phone are you using?" },
      { time:"00:02:37", speaker:"Customer", text:"Pixel." },
      { time:"00:02:39", speaker:"Agent",    text:"Pixel. We may need a different device for the verification step." },
    ],
    resolution: "Unresolved — follow-up required with Samsung phone",
    escalationFlag: true,
    tags:["withdrawal","technical-issue","cash-app","anydesk","regional-restriction","finance"],
  },
  {
    id: "REAL-002", callId: "1755884171.51632",
    type: "EN Support-Billing",
    language: { code:"en", name:"English", label:"English" },
    caller: "Benjamin", agent: "Jorgen",
    department: "Billing / Crypto Withdrawal",
    conversationType: "Customer Support — Billing & Tax Inquiry",
    intent: "Billing & Tax Inquiry",
    sentiment: "concerned",
    sentimentAnalysis: "Customer concerned about tax implications and withdrawal process. Curious about tax-free nature of refund. Determined to minimize taxes. Showed appreciation for agent advice and open to further discussion.",
    urgency: "high", confidenceScore: 81, status: "active",
    duration: 612, isInbound: true,
    keyPoints: [
      "Benjamin discussing withdrawing funds from Atomic cryptocurrency wallet",
      "Agent Jorgen explains refund from Atomic may not be taxable if from non-crypto account",
      "Customer wants to transfer funds to Canadian bank account",
      "Discussion about using EdEx platform instead of Amdex to avoid taxes",
    ],
    actionItems: [
      { task:"Contact Atomic to confirm refund and direct transfer to Canadian bank", priority:"High", due:"ASAP" },
      { task:"Inquire about tax implications and how refund will be justified", priority:"High", due:"ASAP" },
      { task:"Send screenshot of Atomic communication to Jorgen for review", priority:"Medium", due:"Within 24 hours" },
    ],
    customerProblems: [
      '"I never moved anything out of Atomic — my personal knowledge may be limited" – unsure about tax implications',
      '"Can we transfer it back to Index as we planned?" – confused about the transfer process',
      '"That extra fee of almost twenty-seven thousand dollars — is that including Canadian income tax?" – seeking clarity on fees',
    ],
    transcript: [
      { time:"00:00:05", speaker:"Customer", text:"The bank was not even releasing the money for Atomic because that's a different organization." },
      { time:"00:00:17", speaker:"Agent",    text:"Benjamin, can you hear me?" },
      { time:"00:01:10", speaker:"Customer", text:"So what I don't understand is — can we transfer it back to Index as we planned?" },
      { time:"00:01:45", speaker:"Agent",    text:"The question is what type of account the money is coming from. Being one of Canada's largest crypto exchanges, that money will be taxable at some point." },
      { time:"00:02:30", speaker:"Customer", text:"So in other words, that extra fee of almost twenty-seven thousand dollars would be including Canadian income tax? Is that what you're saying?" },
      { time:"00:03:00", speaker:"Agent",    text:"I'd suggest contacting Atomic directly to confirm if the refund transfer can be made to your Canadian bank account." },
      { time:"00:03:45", speaker:"Customer", text:"I'm going to transfer it over to EdEx by myself whether that's possible. I take advantage of every report I can get my hands on." },
    ],
    resolution: "Pending — Benjamin to contact Atomic and send screenshot",
    escalationFlag: false,
    tags:["crypto","withdrawal","tax-inquiry","canada","billing","atomic","edex"],
  },
  {
    id: "REAL-003", callId: "1735556115.459244",
    type: "PL Customer Service",
    language: { code:"pl", name:"Polski", label:"Polish" },
    caller: "Mrs. Jadwica", agent: "Agent (PL)",
    department: "Account Activation / Sales",
    conversationType: "Billing or Account Issue Call",
    intent: "Account Activation Payment",
    sentiment: "confused",
    sentimentAnalysis: "Customer confused and concerned about the payment process and nature of the reserved amount. Seeking clarity and reassurance that the payment is necessary and will be properly handled. Willing to comply once understood.",
    urgency: "high", confidenceScore: 68, status: "escalating",
    duration: 287, isInbound: true,
    keyPoints: [
      "Customer required to pay 1,900 PLN to activate reserved 10,000 PLN sales account",
      "Agent providing banking details and coordinating transfer",
      "Option to delay until January 3rd if transfer cannot be completed today",
      "Customer confused about whether the 1,900 PLN will be returned",
    ],
    actionItems: [
      { task:"Agent to send banking details for 1,900 PLN transfer", priority:"High", due:"Immediate" },
      { task:"Customer to complete the transfer as soon as possible", priority:"High", due:"Immediate" },
      { task:"Agent to confirm transfer once completed", priority:"Medium", due:"Within 24 hours" },
    ],
    customerProblems: [
      '"What does it show that this payment must be made? It is not in total" – confused about 1,900 PLN purpose',
      '"Czy te tysiąc dziewięćset zostanie zwrócone?" – uncertain if 1,900 PLN will be returned',
      '"I don\'t have this document" – lack of written documentation for the process',
    ],
    transcript: [
      { time:"00:00:02", speaker:"Customer", text:"Hello?" },
      { time:"00:00:03", speaker:"Agent",    text:"Hello, good morning!" },
      { time:"00:00:13", speaker:"Agent",    text:"Mrs. Jadwica, what is happening with this payment? You have to pay 1,900 zloty. I'll send you banking details and once confirmed, you transfer the 10,000 to your bank account." },
      { time:"00:01:04", speaker:"Customer", text:"What does it show that this payment must be made? Because it is not in total." },
      { time:"00:01:18", speaker:"Agent",    text:"This is a reserved amount — you just need to fund the 1,900 and it will be activated and returned to your sales account." },
      { time:"00:02:02", speaker:"Customer", text:"Czy te tysiąc dziewięćset zostanie zwrócone? (Will the 1,900 be returned?) So I have to pay 1,900 now — give me the account number." },
    ],
    resolution: "In progress — awaiting bank transfer completion",
    escalationFlag: true,
    tags:["billing","payment","account-activation","polish","transfer","reserved-amount","1900pln"],
  },
  {
    id: "REAL-004", callId: "1735560973.459326",
    type: "PL Account-Billing",
    language: { code:"pl", name:"Polski", label:"Polish" },
    caller: "Male Customer (Frustrated)", agent: "Jurek / Jerzy",
    department: "Account / Forex Positions",
    conversationType: "Account-Billing Dispute",
    intent: "Payment Dispute",
    sentiment: "angry",
    sentimentAnalysis: "Customer is highly frustrated and angry. Multiple unexplained payment demands. Expresses strong distrust and emotional distress. Uses strong language. Feeling financially drained after Christmas. Demanding documentation and threatening to report the company.",
    urgency: "critical", confidenceScore: 55, status: "escalating",
    duration: 378, isInbound: true,
    keyPoints: [
      "Customer on holiday break, financially stressed after Christmas",
      "Invested in GBP/EUR forex — confused about account outcomes",
      "Multiple unexplained payment demands causing distrust",
      "Threatening to contact supervisor after January 3rd",
      "Demanding written documentation and proof of license",
      "Mentions online reviews/reports about the company being fraudulent",
    ],
    actionItems: [
      { task:"Supervisor Piotrek to call customer on Friday before Jan 3rd", priority:"High", due:"Before Jan 3" },
      { task:"Provide complete written documentation for all payment demands", priority:"High", due:"Immediate" },
      { task:"Freeze all account actions until January 3rd", priority:"Critical", due:"Immediate" },
    ],
    customerProblems: [
      '"I have money and I don\'t understand — once they wanted me to pay, now something else" – confused by repeated demands',
      '"I\'m sorry I\'m a bit nervous" – emotionally distressed and stressed',
      '"Give me a paper, a document, that you have a license" – demanding proof of legitimacy',
      '"I won\'t pay more money" – refusing further payments, feeling trapped',
      '"On pages they write about you — companies say you cheated them" – threatening to report',
    ],
    transcript: [
      { time:"00:00:00", speaker:"Customer", text:"Hello! Good morning. How is it?" },
      { time:"00:00:12", speaker:"Customer", text:"Holidays after Christmas... because of your cooperation I have a lot of money tied up and I am poor as a church mouse. New year, a lot to pay." },
      { time:"00:02:13", speaker:"Customer", text:"This case with payment — if I have to pay something back, I don't pay for now because I'm really reset. I'm sorry I'm a bit nervous." },
      { time:"00:02:46", speaker:"Customer", text:"Give me back my money! I don't know what's going on here all the time." },
      { time:"00:03:38", speaker:"Customer", text:"Explain it to me properly so I know what I'm paying for. I will call the manager after January 3rd." },
      { time:"00:04:33", speaker:"Customer", text:"I won't pay more money. Give me someone who can explain this to me like a human being." },
      { time:"00:05:09", speaker:"Customer", text:"On pages they write about you — companies say you cheated them. I don't know anything here, Jerzy." },
    ],
    resolution: "Escalated to Supervisor — pending January 3rd callback",
    escalationFlag: true,
    tags:["dispute","payment","angry","polish","forex","escalation","documentation-request","fraud-concern"],
  },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const LANGUAGES = [
  {code:"hi",name:"हिंदी",  label:"Hindi"  },{code:"en",name:"English",label:"English"},
  {code:"ta",name:"தமிழ்", label:"Tamil"  },{code:"te",name:"తెలుగు",label:"Telugu" },
  {code:"mr",name:"मराठी", label:"Marathi"},{code:"bn",name:"বাংলা", label:"Bengali"},
  {code:"gu",name:"ગુજરાતી",label:"Gujarati"},{code:"kn",name:"ಕನ್ನಡ",label:"Kannada"},
  {code:"pl",name:"Polski", label:"Polish" },
];
const CALL_INTENTS = ["Grievance Filing","Status Inquiry","Survey Response","Emergency Alert","Service Request","Information Query","Feedback","Outreach","Withdrawal Assistance","Billing Inquiry","Account Activation","Payment Dispute"];
const DEPARTMENTS  = ["Water Supply","Road Maintenance","Sanitation","Electricity","Health Services","Education","Police","Revenue","Transport","Finance/Withdrawal","Billing/Crypto","Account Activation"];
const ISSUE_TYPES  = ["Water Shortage","Pothole","Garbage Overflow","Power Outage","Street Light","Drainage Block","Withdrawal Issue","Billing Dispute","Account Activation","Tax Inquiry","Payment Confusion","Technical Issue"];
const WARDS        = ["Ward 1 – Adarsh Nagar","Ward 2 – Civil Lines","Ward 3 – Hazratganj","Ward 4 – Gomti Nagar","Ward 5 – Alambagh","Ward 6 – Chowk","Ward 7 – Aminabad","Ward 8 – Indira Nagar","Ward 9 – Rajajipuram","Ward 10 – Vikas Nagar"];

const AI_MODES = {
  INFORMATIONAL:{label:"Informational",color:"#38bdf8",bg:"rgba(56,189,248,0.12)",icon:"📋"},
  EMPATHETIC:   {label:"Empathetic",   color:"#fbbf24",bg:"rgba(251,191,36,0.12)", icon:"💛"},
  CRISIS:       {label:"Crisis",       color:"#f87171",bg:"rgba(248,113,113,0.12)",icon:"🚨"},
  SURVEY:       {label:"Survey",       color:"#34d399",bg:"rgba(52,211,153,0.12)", icon:"📊"},
  VERIFICATION: {label:"Verification", color:"#fb923c",bg:"rgba(251,146,60,0.12)", icon:"✅"},
};
const SENTIMENT_CFG = {
  positive:   {label:"Positive",    color:"#34d399",icon:"😊"},
  neutral:    {label:"Neutral",     color:"#94a3b8",icon:"😐"},
  cooperative:{label:"Cooperative", color:"#34d399",icon:"🤝"},
  concerned:  {label:"Concerned",   color:"#fbbf24",icon:"😟"},
  confused:   {label:"Confused",    color:"#fb923c",icon:"😕"},
  frustrated: {label:"Frustrated",  color:"#fbbf24",icon:"😤"},
  angry:      {label:"Angry",       color:"#f87171",icon:"😠"},
  distressed: {label:"Distressed",  color:"#f87171",icon:"😢"},
};
const URGENCY_CFG = {
  low:     {color:"#34d399",label:"Low"},    medium:{color:"#fbbf24",label:"Medium"},
  high:    {color:"#fb923c",label:"High"},   critical:{color:"#f87171",label:"Critical"},
};

const rnd      = (a,b) => Math.floor(Math.random()*(b-a)+a);
const randItem = arr => arr[Math.floor(Math.random()*arr.length)];
const fmtTime  = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function generateCalls(n=10){
  return Array.from({length:n},(_,i)=>({
    id:`SIM-${3000+i}`, callId:`sim-${i}`,
    caller:`+91 ${rnd(7000000000,9999999999)}`,
    language:randItem(LANGUAGES), intent:randItem(CALL_INTENTS),
    issue:randItem(ISSUE_TYPES), ward:randItem(WARDS),
    department:randItem(DEPARTMENTS),
    sentiment:randItem(["positive","neutral","frustrated","angry","distressed"]),
    sentimentScore:rnd(10,99), confidenceScore:rnd(55,99),
    urgency:randItem(["low","medium","high","critical"]),
    mode:randItem(Object.keys(AI_MODES)),
    status:randItem(["active","active","active","escalating","transferring"]),
    duration:rnd(20,420), isInbound:Math.random()>.38,
    previousCalls:rnd(0,8), ticketId:`GRV-2024-${rnd(1000,9999)}`,
  }));
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
const Badge = ({color,bg,children,small}) => (
  <span style={{background:bg||`${color}20`,color,border:`1px solid ${color}40`,
    padding:small?"2px 7px":"3px 10px",borderRadius:999,fontSize:small?10:11,
    fontWeight:600,letterSpacing:".4px",whiteSpace:"nowrap"}}>{children}</span>
);
const StatCard = ({label,value,sub,accent,icon}) => (
  <div style={{background:"rgba(15,23,42,0.85)",border:`1px solid ${accent}30`,
    borderRadius:14,padding:"18px 22px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,
      background:`linear-gradient(90deg,transparent,${accent},transparent)`}}/>
    <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
    <div style={{fontSize:28,fontWeight:800,color:accent,fontFamily:"'Courier New',monospace",lineHeight:1}}>{value}</div>
    <div style={{fontSize:11,color:"#64748b",marginTop:4,textTransform:"uppercase",letterSpacing:".8px"}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>{sub}</div>}
  </div>
);
const PulseRing = ({color,size=10}) => (
  <span style={{position:"relative",display:"inline-flex",width:size,height:size}}>
    <span style={{position:"absolute",inset:0,borderRadius:"50%",background:color,
      animation:"ping 1.4s cubic-bezier(0,0,.2,1) infinite",opacity:.6}}/>
    <span style={{width:"100%",height:"100%",borderRadius:"50%",background:color,display:"inline-block"}}/>
  </span>
);
const ConfidenceBar = ({score}) => {
  const c = score>85?"#34d399":score>65?"#fbbf24":"#f87171";
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:5,background:"#1e293b",borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${score}%`,height:"100%",background:c,borderRadius:99,
          transition:"width .6s ease",boxShadow:`0 0 8px ${c}`}}/>
      </div>
      <span style={{fontSize:11,color:c,fontFamily:"monospace",minWidth:32}}>{score}%</span>
    </div>
  );
};
const WaveBar = ({active,color}) => (
  <div style={{display:"flex",alignItems:"center",gap:2,height:24}}>
    {[1,2,3,4,5,6,7,8].map(i=>(
      <div key={i} style={{width:3,height:active?`${rnd(4,22)}px`:4,
        background:active?color:"#1e293b",borderRadius:2,transition:"height .18s ease",
        animation:active?`wave ${.3+i*.08}s ease-in-out infinite alternate`:"none"}}/>
    ))}
  </div>
);

// ─── LIVE CALL CARD ───────────────────────────────────────────────────────────
function LiveCallCard({call,onSelect,isSelected}){
  const [sec,setSec]=useState(call.duration);
  useEffect(()=>{const t=setInterval(()=>setSec(s=>s+1),1000);return()=>clearInterval(t);},[]);
  const sent=SENTIMENT_CFG[call.sentiment]||SENTIMENT_CFG.neutral;
  const urg=URGENCY_CFG[call.urgency]; const mode=AI_MODES[call.mode];
  const esc=call.status==="escalating";
  return (
    <div onClick={()=>onSelect(call)} style={{background:isSelected?"rgba(56,189,248,0.08)":"rgba(15,23,42,0.9)",
      border:`1px solid ${isSelected?"#38bdf8":esc?"#f8711880":"#1e293b"}`,
      borderRadius:12,padding:"13px 15px",cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden"}}>
      {esc&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:"linear-gradient(90deg,#f87118,#fbbf24,#f87118)",
        animation:"shimmer 1.5s linear infinite",backgroundSize:"200% 100%"}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
            <PulseRing color={esc?"#fb923c":"#34d399"} size={8}/>
            <span style={{fontSize:11,fontFamily:"monospace",color:"#94a3b8"}}>{call.id}</span>
            <Badge color={call.isInbound?"#38bdf8":"#a78bfa"} small>{call.isInbound?"↓ IN":"↑ OUT"}</Badge>
          </div>
          <div style={{fontSize:12,color:"#e2e8f0",fontWeight:600}}>{call.caller}</div>
          <div style={{fontSize:11,color:"#64748b"}}>{call.language.name} · {call.language.label}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:16,fontFamily:"monospace",color:"#38bdf8",fontWeight:700}}>{fmtTime(sec)}</div>
          <Badge color={urg.color} small>{urg.label}</Badge>
        </div>
      </div>
      <div style={{marginBottom:7}}>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:3}}>{call.issue}</div>
        <div style={{fontSize:10,color:"#475569"}}>{call.ward}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:11,color:mode.color,background:mode.bg,
          padding:"2px 8px",borderRadius:99,border:`1px solid ${mode.color}30`}}>
          {mode.icon} {mode.label}
        </span>
        <span style={{fontSize:13}}>{sent.icon}</span>
        <WaveBar active={true} color={sent.color||"#94a3b8"}/>
      </div>
      <div style={{marginTop:7}}><ConfidenceBar score={call.confidenceScore}/></div>
      {call.confidenceScore<70&&(
        <div style={{marginTop:6,fontSize:10,color:"#f87171",background:"rgba(248,113,113,0.08)",
          borderRadius:6,padding:"3px 8px",border:"1px solid rgba(248,113,113,0.2)"}}>
          ⚠ Low confidence — escalation recommended
        </div>
      )}
    </div>
  );
}

// ─── CONV SAMPLES (incl. real-inspired) ──────────────────────────────────────
const CONV_SAMPLES = [
  [
    {role:"ai",  text:"नमस्ते! मैं आपका AI सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",delay:0},
    {role:"user",text:"मेरे इलाके में पिछले 3 दिनों से पानी नहीं आ रहा है।",delay:2200},
    {role:"ai",  text:"मुझे खेद है। भावनात्मक स्कोर: तनावग्रस्त → मोड: सहानुभूतिपूर्ण। कृपया अपना वार्ड नंबर बताएं।",delay:4000},
    {role:"user",text:"वार्ड 5, अलामबाग। बच्चों को बहुत परेशानी हो रही है।",delay:6500},
    {role:"ai",  text:"उच्च प्राथमिकता। टिकट GRV-2024-4891 बनाया गया। जल विभाग 24 घंटे में आएगा।",delay:8500},
    {role:"system",text:"📊 Sentiment: neutral→distressed | Priority: LOW→HIGH | Mode: INFORMATIONAL→EMPATHETIC",delay:8800},
  ],
  [
    {role:"ai",  text:"Hello! I'm your AI assistant. How may I help you today?",delay:0},
    {role:"user",text:"There's a massive pothole on the main road causing accidents every day!",delay:2000},
    {role:"system",text:"⚠️ Anger detected (score: 72) | Urgency: LOW→CRITICAL | Auto-assigning Road Dept.",delay:2200},
    {role:"ai",  text:"I understand — this is a safety emergency. Switching to Crisis Response mode. Exact location please?",delay:3800},
    {role:"user",text:"Gomti Nagar crossing, near the flyover, Ward 4.",delay:6000},
    {role:"ai",  text:"Ticket #GRV-2024-5102 — CRITICAL. Road Maintenance dispatched within 6 hrs. Confidence: 94%.",delay:8000},
  ],
  // Inspired by REAL-003 (billing confusion) + REAL-004 (frustration)
  [
    {role:"ai",  text:"Hello, AI Support Agent here. How can I assist you today?",delay:0},
    {role:"user",text:"I don't understand why I need to pay 1,900 zloty. Nobody explains clearly!",delay:2200},
    {role:"system",text:"📊 Confusion + frustration detected | Priority: MEDIUM→HIGH | Mode: INFORMATIONAL→EMPATHETIC",delay:2500},
    {role:"ai",  text:"I completely understand your frustration. Let me pull up your account. [Confidence: 68% — escalation threshold approaching]",delay:4500},
    {role:"user",text:"Just give me a written document that proves what I owe and why. I won't pay blind!",delay:6800},
    {role:"system",text:"🚨 Confidence 68% < 70% threshold | Escalating to human supervisor",delay:7000},
    {role:"ai",  text:"I'm connecting you to a senior officer who can provide full documentation. Case ID: BIL-2024-3318. They'll call within 30 minutes.",delay:8500},
  ],
];

function CallDetailPanel({call}){
  const [convIdx,setConvIdx]=useState(0);
  const [lines,setLines]=useState([]);
  const [running,setRunning]=useState(false);
  const chatRef=useRef(null);
  const sample=CONV_SAMPLES[convIdx%CONV_SAMPLES.length];
  const startConv=useCallback(()=>{
    setLines([]); setRunning(true);
    sample.forEach(({role,text,delay})=>setTimeout(()=>setLines(p=>[...p,{role,text}]),delay));
    setTimeout(()=>setRunning(false),sample[sample.length-1].delay+1200);
  },[convIdx]);
  useEffect(()=>{startConv();},[call?.id]);
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[lines]);
  if(!call)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",
      color:"#334155",fontSize:14,flexDirection:"column",gap:12}}>
      <div style={{fontSize:40}}>☎️</div><div>Select a call to view details</div>
    </div>
  );
  const sent=SENTIMENT_CFG[call.sentiment]||SENTIMENT_CFG.neutral;
  const mode=AI_MODES[call.mode]; const urg=URGENCY_CFG[call.urgency];
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",gap:12}}>
      <div style={{background:"rgba(15,23,42,0.95)",border:"1px solid #1e293b",borderRadius:12,padding:"14px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:"#e2e8f0"}}>{call.caller}</div>
            <div style={{fontSize:11,color:"#64748b"}}>{call.id} · {call.ticketId}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
            <Badge color={urg.color}>{urg.label}</Badge>
            <Badge color={call.isInbound?"#38bdf8":"#a78bfa"}>{call.isInbound?"Inbound":"Outbound"}</Badge>
            {call.previousCalls>0&&<Badge color="#fbbf24">{call.previousCalls}x repeat</Badge>}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["Language",`${call.language.name} (${call.language.label})`],["Intent",call.intent],
            ["Issue",call.issue],["Ward",call.ward],["Department",call.department],
            ["Mode",`${mode.icon} ${mode.label}`]].map(([k,v])=>(
            <div key={k} style={{background:"rgba(30,41,59,0.6)",borderRadius:8,padding:"6px 10px"}}>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase"}}>{k}</div>
              <div style={{fontSize:12,color:"#cbd5e1",marginTop:2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:10,padding:"10px 14px"}}>
          <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",marginBottom:6}}>AI Confidence Score</div>
          <ConfidenceBar score={call.confidenceScore}/>
        </div>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:10,padding:"10px 14px"}}>
          <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",marginBottom:4}}>Caller Sentiment</div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:18}}>{sent.icon}</span>
            <span style={{fontSize:12,color:sent.color,fontWeight:600}}>{sent.label}</span>
          </div>
        </div>
      </div>
      {(call.confidenceScore<70||call.urgency==="critical")&&(
        <div style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:10,padding:"10px 14px"}}>
          <div style={{fontSize:11,color:"#f87171",fontWeight:700,marginBottom:6}}>🔴 Escalation Triggers</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {call.confidenceScore<70&&<Badge color="#f87171" small>Low AI Confidence</Badge>}
            {call.urgency==="critical"&&<Badge color="#f87171" small>Critical Urgency</Badge>}
          </div>
          <div style={{fontSize:11,color:"#94a3b8",marginTop:8,fontStyle:"italic"}}>
            "I am connecting you to a senior support officer for better assistance."
          </div>
        </div>
      )}
      <div style={{flex:1,background:"rgba(15,23,42,0.95)",border:"1px solid #1e293b",
        borderRadius:12,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"10px 14px",borderBottom:"1px solid #1e293b",
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:"#64748b",fontWeight:600}}>Live Conversation Transcript</span>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>{setConvIdx(c=>c+1);startConv();}}
              style={{fontSize:10,color:"#38bdf8",background:"rgba(56,189,248,0.1)",
                border:"1px solid rgba(56,189,248,0.3)",borderRadius:6,padding:"3px 10px",cursor:"pointer"}}>
              ↺ Next Sample
            </button>
            {running&&<PulseRing color="#34d399" size={8}/>}
          </div>
        </div>
        <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
          {lines.map((line,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",
              alignItems:line.role==="user"?"flex-end":line.role==="system"?"center":"flex-start"}}>
              {line.role==="system"?(
                <div style={{fontSize:10,color:"#fbbf24",background:"rgba(251,191,36,0.08)",
                  border:"1px solid rgba(251,191,36,0.2)",borderRadius:6,padding:"4px 10px",maxWidth:"90%",textAlign:"center"}}>
                  {line.text}
                </div>
              ):(
                <div style={{maxWidth:"80%",padding:"8px 12px",borderRadius:10,
                  background:line.role==="ai"?"rgba(56,189,248,0.1)":"rgba(52,211,153,0.1)",
                  border:`1px solid ${line.role==="ai"?"rgba(56,189,248,0.25)":"rgba(52,211,153,0.25)"}`,
                  fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>
                  <div style={{fontSize:9,color:line.role==="ai"?"#38bdf8":"#34d399",
                    textTransform:"uppercase",letterSpacing:".5px",marginBottom:3}}>
                    {line.role==="ai"?"🤖 AI Agent":"👤 Caller"}
                  </div>
                  {line.text}
                </div>
              )}
            </div>
          ))}
          {running&&(
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",
              background:"rgba(56,189,248,0.06)",borderRadius:8,width:"fit-content"}}>
              <WaveBar active={true} color="#38bdf8"/>
              <span style={{fontSize:11,color:"#64748b"}}>AI processing…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REAL CALL CARD ───────────────────────────────────────────────────────────
function RealCallCard({call,onSelect,isSelected}){
  const sent=SENTIMENT_CFG[call.sentiment]||SENTIMENT_CFG.neutral;
  const urg=URGENCY_CFG[call.urgency];
  return(
    <div onClick={()=>onSelect(call)} style={{background:isSelected?"rgba(251,191,36,0.06)":"rgba(15,23,42,0.92)",
      border:`1px solid ${isSelected?"#fbbf24":call.escalationFlag?"#f8711870":"#1e293b"}`,
      borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden"}}>
      {call.escalationFlag&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:"linear-gradient(90deg,#f87118,#fbbf24,#f87118)",
        animation:"shimmer 1.5s linear infinite",backgroundSize:"200% 100%"}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
            <span style={{fontSize:10,background:"rgba(251,191,36,0.15)",color:"#fbbf24",
              border:"1px solid rgba(251,191,36,0.3)",borderRadius:99,padding:"1px 8px"}}>📂 REAL</span>
            <span style={{fontSize:10,color:"#475569",fontFamily:"monospace"}}>{call.callId.slice(0,13)}</span>
          </div>
          <div style={{fontSize:13,color:"#e2e8f0",fontWeight:700}}>{call.caller}</div>
          <div style={{fontSize:11,color:"#64748b"}}>→ {call.agent} · {call.language.label}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:13,fontFamily:"monospace",color:"#38bdf8"}}>{fmtTime(call.duration)}</div>
          <Badge color={urg.color} small>{urg.label}</Badge>
        </div>
      </div>
      <div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>{call.intent}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:12}}>{sent.icon} <span style={{fontSize:11,color:sent.color}}>{sent.label}</span></span>
        <Badge color={call.escalationFlag?"#f87171":"#34d399"} small>
          {call.escalationFlag?"⬆ Escalated":"✅ Resolved"}
        </Badge>
      </div>
      <ConfidenceBar score={call.confidenceScore}/>
    </div>
  );
}

// ─── REAL CALL DETAIL ─────────────────────────────────────────────────────────
function RealCallDetail({call}){
  const [tab,setTab]=useState("transcript");
  if(!call)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",
      color:"#334155",fontSize:14,flexDirection:"column",gap:12}}>
      <div style={{fontSize:40}}>📂</div><div>Select a real call record to view full details</div>
    </div>
  );
  const sent=SENTIMENT_CFG[call.sentiment]||SENTIMENT_CFG.neutral;
  const urg=URGENCY_CFG[call.urgency];
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{background:"rgba(15,23,42,0.95)",border:"1px solid #1e293b",borderRadius:12,padding:"14px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:10,background:"rgba(251,191,36,0.15)",color:"#fbbf24",
                border:"1px solid rgba(251,191,36,0.3)",borderRadius:99,padding:"2px 10px"}}>📂 REAL DATASET</span>
              <span style={{fontSize:10,color:"#475569",fontFamily:"monospace"}}>{call.callId}</span>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0"}}>
              {call.caller} <span style={{color:"#475569",fontSize:12}}>← Agent: {call.agent}</span>
            </div>
            <div style={{fontSize:11,color:"#64748b"}}>{call.conversationType}</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
            <Badge color={urg.color}>{urg.label}</Badge>
            <Badge color={call.language.code==="en"?"#38bdf8":"#a78bfa"}>{call.language.label}</Badge>
            {call.escalationFlag&&<Badge color="#f87171">Escalated</Badge>}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["Department",call.department],["Intent",call.intent],
            ["Duration",fmtTime(call.duration)],["Resolution",call.resolution]].map(([k,v])=>(
            <div key={k} style={{background:"rgba(30,41,59,0.6)",borderRadius:8,padding:"6px 10px"}}>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase"}}>{k}</div>
              <div style={{fontSize:11,color:"#cbd5e1",marginTop:2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:10,padding:"10px 14px"}}>
          <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",marginBottom:4}}>Sentiment</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <span style={{fontSize:18}}>{sent.icon}</span>
            <span style={{fontSize:12,color:sent.color,fontWeight:700}}>{sent.label}</span>
          </div>
          <div style={{fontSize:10,color:"#64748b",lineHeight:1.5}}>{call.sentimentAnalysis.slice(0,110)}…</div>
        </div>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:10,padding:"10px 14px"}}>
          <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",marginBottom:8}}>AI Confidence</div>
          <ConfidenceBar score={call.confidenceScore}/>
          {call.confidenceScore<70&&(
            <div style={{fontSize:10,color:"#f87171",marginTop:6,background:"rgba(248,113,113,0.08)",borderRadius:5,padding:"3px 8px"}}>
              ⚠ Below threshold — escalation triggered
            </div>
          )}
        </div>
      </div>

      <div style={{display:"flex",gap:0,borderBottom:"1px solid #1e293b"}}>
        {[["transcript","💬 Transcript"],["problems","⚠ Issues"],["actions","✅ Actions"],["tags","🏷 Tags"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",
              padding:"8px 14px",fontSize:11,fontWeight:600,
              color:tab===t?"#38bdf8":"#334155",
              borderBottom:tab===t?"2px solid #38bdf8":"2px solid transparent",transition:"all .15s"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        {tab==="transcript"&&(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {call.transcript.map((line,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:10,color:"#334155",fontFamily:"monospace",minWidth:50,paddingTop:2}}>{line.time}</span>
                <div style={{flex:1,background:line.speaker==="Agent"?"rgba(56,189,248,0.07)":"rgba(52,211,153,0.07)",
                  border:`1px solid ${line.speaker==="Agent"?"rgba(56,189,248,0.2)":"rgba(52,211,153,0.2)"}`,
                  borderRadius:8,padding:"7px 12px"}}>
                  <div style={{fontSize:9,color:line.speaker==="Agent"?"#38bdf8":"#34d399",
                    textTransform:"uppercase",letterSpacing:".5px",marginBottom:3}}>
                    {line.speaker==="Agent"?"🤖 "+line.speaker:"👤 "+line.speaker}
                  </div>
                  <div style={{fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>{line.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="problems"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:12,color:"#94a3b8",fontWeight:700,marginBottom:4}}>Detected Customer Problems</div>
            {call.customerProblems.map((p,i)=>(
              <div key={i} style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.2)",
                borderRadius:8,padding:"10px 14px",fontSize:11,color:"#fca5a5",lineHeight:1.6}}>
                <span style={{color:"#f87171",fontWeight:700,marginRight:6}}>#{i+1}</span>{p}
              </div>
            ))}
            <div style={{marginTop:10,fontSize:12,color:"#94a3b8",fontWeight:700,marginBottom:4}}>Key Call Points</div>
            {call.keyPoints.map((p,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{color:"#38bdf8",fontSize:12,marginTop:1}}>▸</span>
                <span style={{fontSize:11,color:"#94a3b8"}}>{p}</span>
              </div>
            ))}
          </div>
        )}
        {tab==="actions"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:12,color:"#94a3b8",fontWeight:700,marginBottom:4}}>Action Items</div>
            {call.actionItems.map((a,i)=>{
              const pc=a.priority==="High"||a.priority==="Critical"?"#f87171":a.priority==="Medium"?"#fbbf24":"#34d399";
              return(
                <div key={i} style={{background:"rgba(30,41,59,0.6)",border:"1px solid #1e293b",borderRadius:8,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <Badge color={pc} small>{a.priority} Priority</Badge>
                    <span style={{fontSize:10,color:"#475569"}}>Due: {a.due}</span>
                  </div>
                  <div style={{fontSize:12,color:"#cbd5e1"}}>{a.task}</div>
                </div>
              );
            })}
          </div>
        )}
        {tab==="tags"&&(
          <div>
            <div style={{fontSize:12,color:"#94a3b8",fontWeight:700,marginBottom:10}}>Tags & Categories</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}>
              {call.tags.map(t=><Badge key={t} color="#a78bfa">#{t}</Badge>)}
            </div>
            <div style={{fontSize:12,color:"#94a3b8",fontWeight:700,marginBottom:8}}>Full Sentiment Analysis</div>
            <div style={{background:"rgba(30,41,59,0.5)",borderRadius:8,padding:"12px",fontSize:11,color:"#94a3b8",lineHeight:1.7}}>
              {call.sentimentAnalysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function BarChart({data,xKey,bars,height=120}){
  const max=Math.max(...data.flatMap(d=>bars.map(b=>d[b.key]||0)));
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:2,height,padding:"0 4px"}}>
      {data.slice(-12).map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",gap:1,height:"100%"}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:1,width:"100%",justifyContent:"center",flex:1}}>
            {bars.map(b=>(
              <div key={b.key} style={{width:`${Math.floor(100/bars.length-2)}%`,minWidth:3,maxWidth:12,
                height:`${((d[b.key]||0)/max)*100}%`,background:b.color,
                borderRadius:"2px 2px 0 0",boxShadow:`0 0 4px ${b.color}60`,minHeight:d[b.key]?3:0}}/>
            ))}
          </div>
          {i%4===0&&<span style={{fontSize:8,color:"#334155",whiteSpace:"nowrap"}}>{d[xKey]}</span>}
        </div>
      ))}
    </div>
  );
}
function DonutChart({segments,size=100}){
  const total=segments.reduce((s,x)=>s+x.value,0); let cum=0;
  const r=size*.4,cx=size/2,cy=size/2,stroke=size*.15;
  const paths=segments.map(seg=>{
    const s=(cum/total)*Math.PI*2-Math.PI/2; cum+=seg.value;
    const e=(cum/total)*Math.PI*2-Math.PI/2;
    const x1=cx+r*Math.cos(s),y1=cy+r*Math.sin(s),x2=cx+r*Math.cos(e),y2=cy+r*Math.sin(e);
    return{d:`M ${x1} ${y1} A ${r} ${r} 0 ${e-s>Math.PI?1:0} 1 ${x2} ${y2}`,color:seg.color,label:seg.label,value:seg.value};
  });
  return(
    <svg width={size} height={size}>
      {paths.map((p,i)=><path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={stroke} strokeLinecap="round" opacity={.85}/>)}
      <circle cx={cx} cy={cy} r={r-stroke/2-2} fill="rgba(15,23,42,0.8)"/>
    </svg>
  );
}

function AnalyticsTab({analytics}){
  const stats=[
    {label:"Total Calls Today",value:analytics.totalCallsToday.toLocaleString(),accent:"#38bdf8",icon:"📞",sub:"↑ 12% vs yesterday"},
    {label:"AI Resolved",value:analytics.resolvedToday.toLocaleString(),accent:"#34d399",icon:"✅",sub:`${analytics.aiResolutionRate}% rate`},
    {label:"Escalated",value:analytics.escalatedToday,accent:"#fb923c",icon:"⬆️",sub:"AI→Human transfers"},
    {label:"Active Now",value:analytics.activeCallsNow,accent:"#a78bfa",icon:"🔴",sub:`${analytics.queuedCalls} queued`},
    {label:"Avg Handle Time",value:`${analytics.avgHandleTime}s`,accent:"#fbbf24",icon:"⏱️",sub:"Per call"},
    {label:"CSAT Score",value:`${analytics.customerSatisfaction}/5`,accent:"#34d399",icon:"⭐",sub:"Satisfaction"},
  ];
  const hC=v=>v>150?"#f87171":v>100?"#fb923c":v>50?"#fbbf24":"#34d399";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {stats.map(s=><StatCard key={s.label} {...s}/>)}
      </div>
      <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px 20px"}}>
        <div style={{fontSize:13,color:"#94a3b8",fontWeight:700,marginBottom:4}}>📈 Hourly Call Volume</div>
        <div style={{display:"flex",gap:12,marginBottom:10}}>
          {[["Inbound","#38bdf8"],["Outbound","#a78bfa"],["Resolved","#34d399"]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:10,height:3,background:c,borderRadius:99}}/><span style={{fontSize:10,color:"#64748b"}}>{l}</span>
            </div>
          ))}
        </div>
        <BarChart data={analytics.hourlyTrend} xKey="hour"
          bars={[{key:"inbound",color:"#38bdf8"},{key:"outbound",color:"#a78bfa"},{key:"resolved",color:"#34d399"}]} height={100}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:12}}>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px"}}>
          <div style={{fontSize:13,color:"#94a3b8",fontWeight:700,marginBottom:10}}>😊 Sentiment Distribution</div>
          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
            <DonutChart segments={analytics.sentimentBreakdown} size={90}/>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {analytics.sentimentBreakdown.map(s=>(
                <div key={s.label} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:s.color}}/>
                  <span style={{fontSize:10,color:"#94a3b8"}}>{s.label}</span>
                  <span style={{fontSize:10,color:s.color,fontWeight:700,marginLeft:"auto"}}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px"}}>
          <div style={{fontSize:13,color:"#94a3b8",fontWeight:700,marginBottom:10}}>🗺️ Ward Heatmap</div>
          {analytics.issueHeatmap.slice(0,6).map(w=>(
            <div key={w.ward} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <span style={{fontSize:10,color:"#475569",minWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.ward}</span>
              <div style={{flex:1,height:7,background:"#0f172a",borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${Math.min((w.issues/200)*100,100)}%`,height:"100%",
                  background:hC(w.issues),borderRadius:99}}/>
              </div>
              <span style={{fontSize:10,color:hC(w.issues),minWidth:28,textAlign:"right"}}>{w.issues}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px 20px"}}>
        <div style={{fontSize:13,color:"#94a3b8",fontWeight:700,marginBottom:12}}>📋 Issue Frequency</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {analytics.issueFrequency.slice(0,8).map((x,i)=>(
            <div key={x.issue} style={{display:"flex",alignItems:"center",gap:8,
              background:"rgba(30,41,59,0.5)",borderRadius:8,padding:"6px 10px"}}>
              <span style={{fontSize:11,color:"#334155",fontFamily:"monospace",minWidth:14}}>#{i+1}</span>
              <span style={{fontSize:11,color:"#94a3b8",flex:1}}>{x.issue}</span>
              <span style={{fontSize:12,color:"#e2e8f0",fontWeight:700}}>{x.count}</span>
              <span style={{fontSize:10,color:x.trend>0?"#f87171":"#34d399"}}>{x.trend>0?"▲":"▼"}{Math.abs(x.trend).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px"}}>
          <div style={{fontSize:13,color:"#94a3b8",fontWeight:700,marginBottom:12}}>⬆️ Escalation Stats</div>
          {[["AI → Human",analytics.escalationStats.aiToHuman,"#fb923c"],
            ["Human → AI",analytics.escalationStats.humanToAI,"#a78bfa"],
            ["Auto Resolved",analytics.escalationStats.autoResolved,"#34d399"],
            ["Pending Review",analytics.escalationStats.pendingReview,"#fbbf24"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:11,color:"#64748b"}}>{l}</span>
              <span style={{fontSize:15,fontWeight:700,color:c,fontFamily:"monospace"}}>{v.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px"}}>
          <div style={{fontSize:13,color:"#94a3b8",fontWeight:700,marginBottom:12}}>🔮 Predictive Alerts</div>
          {analytics.predictiveAlerts.map((a,i)=>{
            const c=a.severity==="critical"?"#f87171":a.severity==="high"?"#fb923c":"#fbbf24";
            return(
              <div key={i} style={{background:`${c}08`,border:`1px solid ${c}25`,borderRadius:8,padding:"8px 10px",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:c,fontWeight:700}}>{a.issue}</span>
                  <Badge color={c} small>{a.change}</Badge>
                </div>
                <div style={{fontSize:10,color:"#475569",marginTop:3}}>{a.ward}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────
function CampaignPanel(){
  const campaigns=[
    {id:"CMP-001",name:"Monsoon Drain Survey",type:"Survey",status:"active",target:5000,reached:3241,success:2190,language:"Hindi/English",dept:"Sanitation"},
    {id:"CMP-002",name:"Voter Awareness Drive",type:"Outreach",status:"active",target:12000,reached:7800,success:6100,language:"Hindi/Telugu",dept:"Election"},
    {id:"CMP-003",name:"Health Camp Notification",type:"Alert",status:"paused",target:2500,reached:1100,success:890,language:"Tamil/Kannada",dept:"Health"},
    {id:"CMP-004",name:"Water Bill Reminder",type:"Reminder",status:"completed",target:8000,reached:8000,success:7200,language:"All Languages",dept:"Water Supply"},
  ];
  const tC={Survey:"#38bdf8",Outreach:"#a78bfa",Alert:"#f87171",Reminder:"#fbbf24"};
  const sC={active:"#34d399",paused:"#fbbf24",completed:"#64748b"};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[{label:"Active",value:"2",accent:"#34d399",icon:"📡"},{label:"Total Outbound",value:"31,500",accent:"#38bdf8",icon:"📤"},{label:"Success Rate",value:"82.3%",accent:"#a78bfa",icon:"✅"},{label:"Avg Duration",value:"94s",accent:"#fbbf24",icon:"⏱️"}].map(s=><StatCard key={s.label} {...s}/>)}
      </div>
      {campaigns.map(c=>(
        <div key={c.id} style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                {c.status==="active"&&<PulseRing color="#34d399" size={8}/>}
                <span style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>{c.name}</span>
                <Badge color={tC[c.type]}>{c.type}</Badge>
              </div>
              <div style={{fontSize:11,color:"#475569"}}>{c.id} · {c.dept} · {c.language}</div>
            </div>
            <Badge color={sC[c.status]}>{c.status.toUpperCase()}</Badge>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
            {[["Target",c.target.toLocaleString(),"#64748b"],["Reached",c.reached.toLocaleString(),"#38bdf8"],["Successful",c.success.toLocaleString(),"#34d399"]].map(([l,v,col])=>(
              <div key={l} style={{background:"rgba(30,41,59,0.5)",borderRadius:8,padding:"8px 12px"}}>
                <div style={{fontSize:10,color:"#475569",textTransform:"uppercase"}}>{l}</div>
                <div style={{fontSize:18,fontWeight:700,color:col,fontFamily:"monospace"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{height:8,background:"#0f172a",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${(c.reached/c.target)*100}%`,height:"100%",
              background:`linear-gradient(90deg,${tC[c.type]},${tC[c.type]}88)`,borderRadius:99}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ARCHITECTURE ─────────────────────────────────────────────────────────────
function ArchitecturePanel(){
  const layers=[
    {title:"📞 Voice Channel",    color:"#38bdf8",items:["Twilio / Exotel / Tata Tele","SIP Trunk Integration","PSTN Gateway","WebRTC Support"]},
    {title:"🎙️ Speech Processing",color:"#a78bfa",items:["Google STT / Bhashini","Multilingual ASR","Noise Cancellation","Neural TTS"]},
    {title:"🧠 AI Engine",        color:"#34d399",items:["LLM: GPT-4 / Claude","Intent Classification","Entity Extraction (NER)","Confidence Scoring"]},
    {title:"💾 Memory & Context", color:"#fbbf24",items:["Redis: Session Memory","PostgreSQL: Call History","Pinecone: Vector Recall","Caller Profile Store"]},
    {title:"📊 Analytics Layer",  color:"#fb923c",items:["Apache Kafka Streaming","Elasticsearch Analytics","ML Anomaly Detection","Grafana Dashboards"]},
    {title:"🔐 Security & DPDP",  color:"#f87171",items:["AES-256 Encryption","Consent Logging","Role-Based Access","Audit Trails"]},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px 20px"}}>
        <div style={{fontSize:14,color:"#94a3b8",fontWeight:700,marginBottom:14}}>🏗️ System Architecture</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {layers.map(l=>(
            <div key={l.title} style={{background:"rgba(30,41,59,0.6)",border:`1px solid ${l.color}25`,
              borderRadius:10,padding:"12px 14px",borderTop:`3px solid ${l.color}`}}>
              <div style={{fontSize:12,fontWeight:700,color:l.color,marginBottom:8}}>{l.title}</div>
              {l.items.map(item=>(
                <div key={item} style={{fontSize:10,color:"#64748b",padding:"3px 0",
                  borderBottom:"1px solid #0f172a",display:"flex",alignItems:"center",gap:5}}>
                  <span style={{color:l.color,fontSize:8}}>▸</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"rgba(15,23,42,0.9)",border:"1px solid #1e293b",borderRadius:14,padding:"16px 20px"}}>
        <div style={{fontSize:14,color:"#94a3b8",fontWeight:700,marginBottom:14}}>🔄 AI Call Flow</div>
        <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",paddingBottom:8}}>
          {[{step:"Caller",icon:"📱",color:"#38bdf8"},{step:"PSTN/VoIP",icon:"📡",color:"#a78bfa"},
            {step:"STT Engine",icon:"🎙️",color:"#34d399"},{step:"NLU/Intent",icon:"🧠",color:"#fbbf24"},
            {step:"Context",icon:"💾",color:"#fb923c"},{step:"LLM",icon:"🤖",color:"#38bdf8"},
            {step:"Confidence",icon:"📊",color:"#a78bfa"},{step:"TTS",icon:"🔊",color:"#34d399"},
            {step:"Ticket+Log",icon:"📋",color:"#fbbf24"}].map((node,i,arr)=>(
            <div key={node.step} style={{display:"flex",alignItems:"center",flexShrink:0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:70}}>
                <div style={{fontSize:18,marginBottom:3}}>{node.icon}</div>
                <div style={{width:36,height:36,borderRadius:"50%",background:`${node.color}15`,
                  border:`1.5px solid ${node.color}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:node.color}}/>
                </div>
                <div style={{fontSize:9,color:"#475569",marginTop:4,textAlign:"center",lineHeight:1.2}}>{node.step}</div>
              </div>
              {i<arr.length-1&&<div style={{width:18,height:1.5,
                background:`linear-gradient(90deg,${node.color}60,${arr[i+1].color}60)`,
                flexShrink:0,marginBottom:14}}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [activeTab,setActiveTab]=useState("live");
  const [calls,setCalls]=useState(()=>generateCalls(10));
  const [selectedCall,setSelectedCall]=useState(null);
  const [selectedReal,setSelectedReal]=useState(null);

  const [analytics]=useState(()=>{
    const hourly=Array.from({length:24},(_,h)=>{
      const p=h>8&&h<20?1:.18;
      return{hour:`${String(h).padStart(2,"0")}:00`,inbound:rnd(5,Math.floor(200*p)),outbound:rnd(2,Math.floor(130*p)),resolved:rnd(4,Math.floor(175*p))};
    });
    return{
      totalCallsToday:4876,resolvedToday:3245,escalatedToday:416,
      avgHandleTime:187,aiResolutionRate:78.4,customerSatisfaction:4.1,
      activeCallsNow:89,queuedCalls:23,
      hourlyTrend:hourly,
      issueHeatmap:WARDS.map(ward=>({ward,issues:rnd(10,200),resolved:rnd(5,150),critical:rnd(0,30)})),
      sentimentBreakdown:[
        {label:"Positive",value:31,color:"#34d399"},{label:"Neutral",value:38,color:"#38bdf8"},
        {label:"Cooperative",value:8,color:"#a78bfa"},{label:"Confused",value:10,color:"#fb923c"},
        {label:"Frustrated",value:8,color:"#fbbf24"},{label:"Angry",value:5,color:"#f87171"},
      ],
      issueFrequency:ISSUE_TYPES.map(issue=>({issue,count:rnd(20,500),trend:(Math.random()-.4)*40})).sort((a,b)=>b.count-a.count),
      escalationStats:{aiToHuman:286,humanToAI:128,autoResolved:3645,pendingReview:160},
      predictiveAlerts:[
        {type:"spike",issue:"Water Shortage",ward:"Ward 5 – Alambagh",change:"+340%",severity:"critical"},
        {type:"pattern",issue:"Billing Disputes",ward:"Global Dataset",change:"+87%",severity:"high"},
        {type:"anomaly",issue:"Garbage Overflow",ward:"Ward 8 – Indira Nagar",change:"+87%",severity:"medium"},
      ],
    };
  });

  useEffect(()=>{
    const t=setInterval(()=>setCalls(prev=>{
      const u=[...prev],idx=rnd(0,u.length);
      u[idx]={...u[idx],sentimentScore:rnd(10,99),confidenceScore:rnd(55,99)};
      return u;
    }),3000); return()=>clearInterval(t);
  },[]);
  useEffect(()=>{
    const t=setInterval(()=>setCalls(prev=>{
      if(prev.length<16&&Math.random()>.5) return [...prev,...generateCalls(1)];
      if(prev.length>7) return prev.filter((_,i)=>i!==rnd(0,prev.length));
      return prev;
    }),6000); return()=>clearInterval(t);
  },[]);

  const escalating=calls.filter(c=>c.status==="escalating");
  const realEsc=REAL_CALL_DATASET.filter(c=>c.escalationFlag).length;
  const tabs=[
    {id:"live",    label:"🔴 Live Calls",   count:calls.length},
    {id:"dataset", label:"📂 Real Dataset",  count:REAL_CALL_DATASET.length, hi:true},
    {id:"analytics",label:"📊 Analytics"},
    {id:"campaigns",label:"📡 Campaigns"},
    {id:"arch",    label:"🏗️ Architecture"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#020817",fontFamily:"'IBM Plex Mono','Courier New',monospace",color:"#e2e8f0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
        @keyframes ping{0%{transform:scale(1);opacity:.8}75%,100%{transform:scale(2.2);opacity:0}}
        @keyframes wave{from{transform:scaleY(.4)}to{transform:scaleY(1)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 12px rgba(56,189,248,0.3)}50%{box-shadow:0 0 24px rgba(56,189,248,0.6)}}
      `}</style>

      {/* Top Bar */}
      <div style={{background:"rgba(9,14,26,0.98)",borderBottom:"1px solid #0f172a",
        padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",
        position:"sticky",top:0,zIndex:50,backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#38bdf8,#6366f1)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 20px rgba(56,189,248,0.4)"}}>☎</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",fontFamily:"'Syne',sans-serif"}}>VaaniAI · Multilingual Calling Agent</div>
            <div style={{fontSize:10,color:"#334155",letterSpacing:".5px"}}>PUBLIC GRIEVANCE & CITIZEN SERVICES · REAL DATASET INTEGRATED</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(251,191,36,0.1)",
            border:"1px solid rgba(251,191,36,0.3)",borderRadius:8,padding:"5px 12px"}}>
            <span style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>📂 {REAL_CALL_DATASET.length} REAL CALLS · {realEsc} ESCALATED</span>
          </div>
          {escalating.length>0&&(
            <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(248,113,113,0.1)",
              border:"1px solid rgba(248,113,113,0.3)",borderRadius:8,padding:"5px 12px",animation:"glow 2s ease-in-out infinite"}}>
              <PulseRing color="#f87171" size={8}/>
              <span style={{fontSize:11,color:"#f87171",fontWeight:700}}>{escalating.length} ESCALATING</span>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(52,211,153,0.08)",
            border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,padding:"5px 12px"}}>
            <PulseRing color="#34d399" size={8}/>
            <span style={{fontSize:11,color:"#34d399",fontWeight:600}}>{calls.length} LIVE SIM</span>
          </div>
        </div>
      </div>

      {/* Language Bar */}
      <div style={{background:"rgba(9,14,26,0.95)",borderBottom:"1px solid #0f172a",
        padding:"7px 24px",display:"flex",gap:6,alignItems:"center",overflowX:"auto"}}>
        <span style={{fontSize:10,color:"#334155",marginRight:4,whiteSpace:"nowrap"}}>ACTIVE LANGUAGES:</span>
        {LANGUAGES.map(l=>(
          <div key={l.code} style={{display:"flex",alignItems:"center",gap:4,
            background:"rgba(30,41,59,0.6)",border:"1px solid #1e293b",
            borderRadius:99,padding:"2px 10px",whiteSpace:"nowrap"}}>
            <span style={{fontSize:11,color:"#38bdf8"}}>{l.name}</span>
            <span style={{fontSize:10,color:"#334155"}}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{background:"rgba(9,14,26,0.9)",borderBottom:"1px solid #0f172a",padding:"0 24px",display:"flex",gap:0}}>
        {tabs.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{background:"none",border:"none",cursor:"pointer",padding:"12px 18px",fontSize:12,
              fontFamily:"inherit",fontWeight:600,
              color:activeTab===tab.id?(tab.hi?"#fbbf24":"#38bdf8"):"#334155",
              borderBottom:activeTab===tab.id?`2px solid ${tab.hi?"#fbbf24":"#38bdf8"}`:"2px solid transparent",
              transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
            {tab.label}
            {tab.count!==undefined&&(
              <span style={{background:tab.hi?"rgba(251,191,36,0.15)":"rgba(56,189,248,0.15)",
                color:tab.hi?"#fbbf24":"#38bdf8",borderRadius:99,padding:"1px 7px",fontSize:10}}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{padding:"20px 24px",maxWidth:1600,margin:"0 auto"}}>

        {activeTab==="live"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:16,minHeight:"80vh"}}>
            <div style={{display:"flex",flexDirection:"column",gap:10,overflowY:"auto",maxHeight:"calc(100vh - 200px)"}}>
              {[...calls].sort((a,b)=>{
                const s=c=>(c.urgency==="critical"?3:c.urgency==="high"?2:1)+(c.status==="escalating"?2:0);
                return s(b)-s(a);
              }).map(call=>(
                <div key={call.id} style={{animation:"fadeIn .3s ease"}}>
                  <LiveCallCard call={call} onSelect={setSelectedCall} isSelected={selectedCall?.id===call.id}/>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(9,14,26,0.6)",border:"1px solid #0f172a",borderRadius:16,padding:16,overflowY:"auto",maxHeight:"calc(100vh - 200px)"}}>
              <CallDetailPanel call={selectedCall}/>
            </div>
          </div>
        )}

        {activeTab==="dataset"&&(
          <div>
            <div style={{background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.25)",
              borderRadius:12,padding:"14px 20px",marginBottom:16,
              display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:13,color:"#fbbf24",fontWeight:700,marginBottom:4}}>📂 Real Call Center Dataset — Integrated from Your Uploads</div>
                <div style={{fontSize:11,color:"#64748b"}}>
                  4 transcripts · EN Customer Support · EN Support-Billing · PL Customer Service · PL Account-Billing
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,minWidth:360}}>
                {[["Records","4","#fbbf24"],["Languages","EN + PL","#38bdf8"],
                  ["Escalated",`${realEsc}`,"#f87171"],
                  ["Avg Duration",`${Math.floor(REAL_CALL_DATASET.reduce((s,c)=>s+c.duration,0)/REAL_CALL_DATASET.length)}s`,"#34d399"]].map(([l,v,c])=>(
                  <div key={l} style={{background:"rgba(15,23,42,0.7)",borderRadius:8,padding:"8px 12px"}}>
                    <div style={{fontSize:9,color:"#475569",textTransform:"uppercase"}}>{l}</div>
                    <div style={{fontSize:16,fontWeight:700,color:c,fontFamily:"monospace"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:16,minHeight:"70vh"}}>
              <div style={{display:"flex",flexDirection:"column",gap:10,overflowY:"auto",maxHeight:"calc(100vh - 290px)"}}>
                {REAL_CALL_DATASET.map(call=>(
                  <div key={call.id} style={{animation:"fadeIn .3s ease"}}>
                    <RealCallCard call={call} onSelect={setSelectedReal} isSelected={selectedReal?.id===call.id}/>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(9,14,26,0.6)",border:"1px solid #0f172a",borderRadius:16,padding:16,overflowY:"auto",maxHeight:"calc(100vh - 290px)"}}>
                <RealCallDetail call={selectedReal}/>
              </div>
            </div>
          </div>
        )}

        {activeTab==="analytics"&&<AnalyticsTab analytics={analytics}/>}
        {activeTab==="campaigns"&&<CampaignPanel/>}
        {activeTab==="arch"&&<ArchitecturePanel/>}
      </div>
    </div>
  );
}