// الترحيب الصوتي
const enterBtn = document.getElementById("enterBtn");
const darkBtn = document.getElementById("darkModeBtn");

enterBtn.addEventListener("click", () => {
  const name = document.getElementById("userName").value.trim();
  if(!name){ alert("من فضلك اكتب اسمك بالكامل"); return; }
  const text = `الدكتورة آيه أحمد نجم ترحب بكم ${name} وتهنئكم بالسنة الجديدة، استمتعوا!`;
  speak(text);
  document.getElementById("welcome").classList.remove("active");
  document.getElementById("nav").classList.remove("hidden");
  goTo("goal");
});

// Dark Mode Toggle
darkBtn.addEventListener("click", () => { document.body.classList.toggle("dark-mode"); });

// Text-to-Speech
function speak(text){
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = "ar-SA";
  msg.rate = 0.9;
  window.speechSynthesis.speak(msg);
}

// SPA Navigation
function goTo(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// الهدف
let goal = "cut";
function setGoal(g){ goal=g; goTo("data"); }

// الأصوات التفاعلية
const sounds = {
  meal: new Audio("sounds/meal.mp3"),
  exercise: new Audio("sounds/exercise.mp3"),
  hover: new Audio("sounds/hover.mp3")
};

// وجبات متنوعة لكل يوم
const mealOptions = {
  cut: [
    ["بيض + شوفان","فراخ + رز","زبادي + فاكهة"],
    ["توست + بيض","سمك + خضار","فاكهة + مكسرات"],
    ["عصير + شوفان","دجاج + بطاطس","زبادي + فواكه"],
    ["بيض مسلوق + خيار","سمك + ارز بني","فاكهة + مكسرات"],
    ["فول + بيض","لحم + خضار","زبادي + فواكه"],
    ["عصير طبيعي + توست","دجاج + خضار","فاكهة + مكسرات"],
    ["شوفان + فواكه","سمك + ارز","زبادي + مكسرات"]
  ],
  bulk: [
    ["بيض + شوفان + موز","لحمة + مكرونة","مكسرات + عشاء خفيف"],
    ["عصير + توست","دجاج + رز","زبادي + فاكهة"],
    ["بيض + خبز + جبن","سمك + بطاطس","فاكهة + مكسرات"],
    ["توست + بيض + فواكه","لحم + خضار + رز","زبادي + فواكه"],
    ["شوفان + حليب + موز","دجاج + مكرونة","مكسرات + فواكه"],
    ["بيض + توست","سمك + ارز","زبادي + مكسرات"],
    ["فول + بيض + توست","لحم + خضار + بطاطس","فاكهة + مكسرات"]
  ]
};

// إنشاء النظام الغذائي الذكي + رسومات 3D + تمارين
function buildPlan(){
  const w = +weight.value, h = +height.value, a = +age.value, act = +activity.value;
  if(!w||!h||!a){ alert("أدخل كل البيانات"); return; }

  let bmr = 10*w + 6.25*h -5*a+5;
  let calories = Math.round(bmr*act);
  calories += goal==="cut"? -500:500;
  document.getElementById("calories").innerText = calories + " kcal";

  displayMeals3D();
  displayExercises3D();
  goTo("plan");

  // حفظ البيانات
  const userData={goal,w,h,a,act,calories};
  localStorage.setItem("smartNutritionUser",JSON.stringify(userData));
}

// عرض وجبات 3D
function displayMeals3D(){
  const mealsDiv=document.getElementById("meals");
  mealsDiv.innerHTML="";
  const plan = mealOptions[goal];
  plan.forEach((dayMeals,i)=>{
    const dayBox=document.createElement("div"); dayBox.classList.add("box3d");
    const inner=document.createElement("div"); inner.classList.add("box3d-inner");
    inner.innerHTML = `<h4>اليوم ${i+1}</h4>
      <p>08:00 فطار: ${dayMeals[0]}</p>
      <p>13:00 غداء: ${dayMeals[1]}</p>
      <p>19:00 عشاء: ${dayMeals[2]}</p>
      <img src="images/meal${i+1}.jpg" alt="وجبة اليوم">`;
    inner.addEventListener("click", ()=> sounds.meal.play());
    inner.addEventListener("mouseenter", ()=> sounds.hover.play());
    dayBox.appendChild(inner); mealsDiv.appendChild(dayBox);
  });
}

// عرض تمارين 3D
function displayExercises3D(){
  const exDiv=document.getElementById("exerciseList");
  exDiv.innerHTML="";
  const exercises=[
    {name:"تمرين Cardio 5 دقائق", img:"images/ex1.jpg"},
    {name:"تمرين Strength 10 دقائق", img:"images/ex2.jpg"},
    {name:"تمرين Stretching 5 دقائق", img:"images/ex3.jpg"}
  ];
  exercises.forEach(ex=>{
    const box=document.createElement("div"); box.classList.add("box3d");
    const inner=document.createElement("div"); inner.classList.add("box3d-inner");
    inner.innerHTML=`<h4>${ex.name}</h4><img src="${ex.img}" alt="${ex.name}">`;
    inner.addEventListener("click", ()=> sounds.exercise.play());
    inner.addEventListener("mouseenter", ()=> sounds.hover.play());
    box.appendChild(inner); exDiv.appendChild(box);
  });
}

// PWA - تسجيل Service Worker
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("sw.js").then(reg=>{
      console.log("Service Worker مسجل:", reg);
    }).catch(err=>console.log("فشل التسجيل:", err));
  });
}
