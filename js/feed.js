// Initialize Feather icons
feather.replace();

// Sample posts data
const posts = [
  {
    id: 1,
    title: "Flexbox? More Like Gaslightbox 💀",
    author: "Braxxxton",
    content:
      "🚀🔥 Just deployed my React app, and tell me why CSS Flexbox is STILL gaslighting me?? 💀 Like, I deadass set justify-content: center, but my divs out here playing musical chairs. 😭 I refresh, and boom—everything’s vibing in Narnia. Someone PLEASE drop a W fix before I start full-on beefing with VS Code. Fr, at this point, I need a therapist for my CSS. 🫠",
    likes: 234,
    comments: 45,
    image: "../api/images/posts/post1.png",
  },
  {
    id: 2,
    title: "Tailwind or Jailwind? 🤨",
    author: "Zephryx",
    content:
      "Nahhh, if you’re still writing vanilla CSS in 2025, are you good?? 😭 Tailwind is literally the GOAT 🐐💨—typing flex items-center justify-center just hits different. Manual CSS? That’s giving flip phone energy. 📵 I see margin: 0 auto and I just know the dev is fighting for their life. 💀 Do yourself a favor, download Tailwind, and let the utility classes cook. 🔥",
    likes: 189,
    comments: 32,
    image: "/api/placeholder/400/300",
  },
  {
    id: 3,
    title: "JSX? More Like J-Suspect 🤨",
    author: "Braxxxton",
    content:
      "Bruh, JSX is so ✨delulu✨ sometimes. Like, why I gotta wrap EVERYTHING in one parent element?? My <div>s are stacking like unpaid bills. 😩 Also, can we talk about how map() is an instant glow-up for rendering lists? One second, you’re manually typing out <li>, the next, you’re printing arrays like you own a factory. 📈 It feels borderline illegal how smooth it is. Lowkey might start gatekeeping React before y’all ruin it. 💅",
    likes: 11,
    comments: 2,
    image: "/api/placeholder/400/300",
  },
  {
    id: 4,
    title: "JavaScript Be Gaslighting Me HARD 💀",
    author: "Braxxxton",
    content:
      "Tell me why I write console.log(variable) and JavaScript is like: “Undefined.” 🤨 Bro, you were JUST there. I SAW you. 👀 Then I add a setTimeout() and suddenly, it works??? Nah, JavaScript be moving like it’s in witness protection. 🫠 And don’t even get me started on null vs undefined—that’s a beef I’m taking to the grave. 💀",
    likes: 18,
    comments: 38,
    image: "/api/placeholder/400/300",
  },
  {
    id: 5,
    title: "CSS Grid? More Like Gridlock 🚦",
    author: "Zephryx",
    content:
      "Ayo, CSS Grid is mad powerful, but why do I feel like I need a PhD to use it?? 😭 One wrong grid-template-areas move, and suddenly my layout looks like it was coded in Microsoft Paint. 🎨 Bro, I just wanted a simple 3-column design, not a Picasso masterpiece. 💀 Somebody PLEASE tell me the Grid cheat codes before I start coding with absolute positioning out of spite. 🫠",
    likes: 202,
    comments: 111,
    image: "/api/placeholder/400/300",
  },
  {
    id: 6,
    title: "React State? More Like React Trauma 😵‍💫",
    author: "Zephryx",
    content:
      "Why is managing state in React more stressful than my situationship? 🤡 I update one variable, and suddenly my entire component remounts like it’s auditioning for a reboot. 😭 Then I discover the useEffect() dependency array and BOOM—everything either runs infinitely or doesn’t run at all. 💀 Like damn React, you could’ve just said you hated me. 🫠",
    likes: 65,
    comments: 45,
    image: "/api/placeholder/400/300",
  },
];

// Render posts using a for loop
function renderPosts() {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";

  for (let post of posts) {
    const postElement = document.createElement("div");
    postElement.className =
      "bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden";

    postElement.innerHTML = `
                    <div class="flex flex-col md:flex-row">
                        <div class="w-full md:w-72 md:flex-shrink-0">
                            <img src="${post.image}" 
                                 alt="${post.title}" 
                                 class="w-full h-48 md:h-full object-cover">
                        </div>
                        <div class="flex-1 flex flex-col">
                            <div class="p-6">
                                <h3 class="font-semibold text-xl mb-2">${post.title}</h3>
                                <p class="text-sm text-gray-500 mb-4">By ${post.author}</p>
                                <div class="prose max-w-none">
                                    <p class="text-gray-600 whitespace-pre-line">${post.content}</p>
                                </div>
                            </div>
                            <div class="p-6 border-t mt-auto">
                                <div class="flex justify-between items-center">
                                    <div class="flex gap-4">
                                        <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                                            <i data-feather="heart" class="h-4 w-4"></i>
                                            ${post.likes}
                                        </button>
                                        <button class="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                                            <i data-feather="message-circle" class="h-4 w-4"></i>
                                            ${post.comments}
                                        </button>
                                    </div>
                                    <div class="flex gap-2">
                                        <button class="text-gray-600 hover:text-gray-800">
                                            <i data-feather="share-2" class="h-4 w-4"></i>
                                        </button>
                                        <button class="text-gray-600 hover:text-gray-800">
                                            <i data-feather="bookmark" class="h-4 w-4"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

    // Add margin bottom to all posts except the last one
    if (posts.indexOf(post) < posts.length - 1) {
      postElement.classList.add("mb-8");
    }

    container.appendChild(postElement);
  }

  // Reinitialize Feather icons
  feather.replace();

  // Add click event listeners to buttons
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("Button clicked", e.currentTarget);
    });
  });
}

// Modal handling
const modal = document.getElementById("modal");
const newPostBtn = document.getElementById("newPostBtn");
const closeModal = document.getElementById("closeModal");
const fileInput = document.getElementById("fileInput");
const selectImageBtn = document.getElementById("selectImageBtn");
const dropZone = document.getElementById("dropZone");
const newPostForm = document.getElementById("newPostForm");

newPostBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// File upload handling
selectImageBtn.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("border-blue-500");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("border-blue-500");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("border-blue-500");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    handleFile(file);
  }
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
});

function handleFile(file) {
  // Handle file upload logic here
  console.log("File selected:", file.name);
}

newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Handle form submission logic here
  modal.classList.add("hidden");
});

// Initial render
renderPosts();
