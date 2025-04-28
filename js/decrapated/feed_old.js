import { apiGet } from "../api/getAPI.js";

// Initialize Feather icons
feather.replace();

// Sample posts data
export const posts = [
  {
    id: 1,
    title: "Flexbox? More Like Gaslightbox 💀",
    author: "Braxxxton",
    content:
      "🚀🔥 Just deployed my React app, and tell me why CSS Flexbox is STILL gaslighting me?? 💀 Like, I deadass set justify-content: center, but my divs out here playing musical chairs. 😭 I refresh, and boom—everything’s vibing in Narnia. Someone PLEASE drop a W fix before I start full-on beefing with VS Code. Fr, at this point, I need a therapist for my CSS. 🫠",
    likes: 234,
    comments: 45,
    image: "../api/images/posts/post1.jpg",
  },
  {
    id: 2,
    title: "Tailwind or Jailwind? 🤨",
    author: "Zephryx",
    content:
      "Nahhh, if you’re still writing vanilla CSS in 2025, are you good?? 😭 Tailwind is literally the GOAT 🐐💨—typing flex items-center justify-center just hits different. Manual CSS? That’s giving flip phone energy. 📵 I see margin: 0 auto and I just know the dev is fighting for their life. 💀 Do yourself a favor, download Tailwind, and let the utility classes cook. 🔥",
    likes: 189,
    comments: 32,
    image: "../api/images/posts/post2.jpg",
  },
  {
    id: 3,
    title: "JSX? More Like J-Suspect 🤨",
    author: "Braxxxton",
    content:
      "Bruh, JSX is so ✨delulu✨ sometimes. Like, why I gotta wrap EVERYTHING in one parent element?? My &lt;div&gt;s are stacking like unpaid bills. 😩 Also, can we talk about how map() is an instant glow-up for rendering lists? One second, you’re manually typing out &ltli&gt, the next, you’re printing arrays like you own a factory. 📈 It feels borderline illegal how smooth it is. Lowkey might start gatekeeping React before y’all ruin it. 💅",
    likes: 11,
    comments: 2,
    image: "../api/images/posts/post3.jpg",
  },
  {
    id: 4,
    title: "JavaScript Be Gaslighting Me HARD 💀",
    author: "Braxxxton",
    content:
      "Tell me why I write console.log(variable) and JavaScript is like: “Undefined.” 🤨 Bro, you were JUST there. I SAW you. 👀 Then I add a setTimeout() and suddenly, it works??? Nah, JavaScript be moving like it’s in witness protection. 🫠 And don’t even get me started on null vs undefined—that’s a beef I’m taking to the grave. 💀",
    likes: 18,
    comments: 38,
    image: "../api/images/posts/post4.jpg",
  },
  {
    id: 5,
    title: "CSS Grid? More Like Gridlock 🚦",
    author: "Zephryx",
    content:
      "Ayo, CSS Grid is mad powerful, but why do I feel like I need a PhD to use it?? 😭 One wrong grid-template-areas move, and suddenly my layout looks like it was coded in Microsoft Paint. 🎨 Bro, I just wanted a simple 3-column design, not a Picasso masterpiece. 💀 Somebody PLEASE tell me the Grid cheat codes before I start coding with absolute positioning out of spite. 🫠",
    likes: 202,
    comments: 111,
    image: "../api/images/posts/post5.jpg",
  },
  {
    id: 6,
    title: "React State? More Like React Trauma 😵‍💫",
    author: "Braxxxton",
    content:
      "Why is managing state in React more stressful than my situationship? 🤡 I update one variable, and suddenly my entire component remounts like it’s auditioning for a reboot. 😭 Then I discover the useEffect() dependency array and BOOM—everything either runs infinitely or doesn’t run at all. 💀 Like damn React, you could’ve just said you hated me. 🫠",
    likes: 65,
    comments: 45,
    image: "../api/images/posts/post6.jpg",
  },
];

const postData = await apiGet("/social/posts", {
  limit: 10,
  offset: 0,
  sort: "created",
  sortOrder: "desc",
});
console.log(postData);

// Render posts using a for loop
function renderPosts() {
  const container = document.getElementById("postsContainer");
  if (!container) return; // Guard clause if container doesn't exist

  container.innerHTML = "";

  for (let post of postData) {
    const postElement = document.createElement("div");
    postElement.className =
      "bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden";

    postElement.innerHTML = `
      <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-72 md:flex-shrink-0">
              <img src="${post.data.media.url}" 
                   alt="${post.data.title}" 
                   class="w-full h-48 md:h-full object-cover">
          </div>
          <div class="flex-1 flex flex-col">
              <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-800">${post.data.title}</h3>
                  <p class="text-sm text-gray-500 mb-4">By ${post.data.author}</p>
                  <div class="prose max-w-none">
                      <p class="text-gray-700 whitespace-pre-line">${post.data.body}</p>
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
    if (postData.indexOf(post) < postData.length - 1) {
      postElement.classList.add("mb-8");
    }

    container.appendChild(postElement);
  }

  // Reinitialize Feather icons
  feather.replace();

  // FOR FUTURE REFERENCE Add click event listeners to buttons
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      console.log("Button clicked", e.currentTarget);
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
});
