import {
  fetchPost,
  postComment,
  fetchProfileData,
} from "../../posts/apiService.js";
import { renderComments } from "../../comments/commentRenderer.js";
import { createModal } from "../createModal.js";
import { createPostCard } from "../../posts/postRenderer.js";
import { setupFollowButton } from "./followProfile.js";

export async function refreshAll(postId, currentUser) {
  //Fetch the updated post data (includes updated comments & reactions)
  const updatedPost = await fetchPost(postId);

  // Fetch the updated profile for accurate follower count
  const updatedProfile = await fetchProfileData(updatedPost.author.name);
  const followerCount = updatedProfile._count.followers;
  const followersArray = updatedProfile.followers;

  // Re-render the post card (update counters, reactions, etc.)
  const postCardContainer = document.getElementById("singlePostDiv");
  postCardContainer.innerHTML = "";
  const newPostCard = createPostCard(updatedPost, followerCount);
  postCardContainer.appendChild(newPostCard);

  //Re-initialize the follow button with fresh data
  setupFollowButton({
    btnId: "followBtn",
    profileName: updatedPost.author.name,
    userName: currentUser,
    followersArray: followersArray,
    onFollowChange: () => refreshAll(postId, currentUser),
  });

  //Call comment modal
  let currentPostId = null;
  let currentCommentId = null;

  //Re-initialize the comment modal (since the button was recreated)
  createModal({
    openButtonSelector: "#postCommentBtn",
    modalId: "commentModal",
    closeButtonId: "closeCommentModal",
    formId: "commentForm",
    onOpen: (btn, modal) => {
      currentPostId = btn.dataset.postId;
      console.log(currentPostId);
    },
    onSubmit: async () => {
      await postComment(
        currentPostId,
        null,
        document.querySelector("#commentContent").value
      );
      await refreshAll(postId, currentUser, followerCount);
    },
  });

  //Re-render the comments
  const commentsContainer = document.getElementById("commentsContainer");
  renderComments(updatedPost.comments, currentUser, commentsContainer);

  // Re-initialize the reply modal (since reply buttons were recreated)
  createModal({
    openButtonSelector: ".reply-comment-btn",
    modalId: "replyModal",
    closeButtonId: "closeReplyModal",
    formId: "replyForm",
    onOpen: (btn, modal) => {
      currentPostId = btn.dataset.postId;
      currentCommentId = Number(btn.dataset.commentId);
      console.log(currentPostId, currentCommentId);
    },
    onSubmit: async () => {
      const replyValue = document.querySelector("#replyContent").value;
      await postComment(currentPostId, currentCommentId, replyValue);
      await refreshAll(postId, currentUser, followerCount);
    },
  });
}
