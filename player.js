let player;
let isFirstPlay = true;
let items;

window.onYouTubeIframeAPIReady = function () {
  const playlistId = document
    .querySelector(".text-playlist")
    ?.textContent?.trim();

  const playerElement = document.getElementById("player");

  if (!playerElement) {
    console.error("❌ Елемент #player не знайдено!");
    return;
  }

  player = new YT.Player("player", {
    width: "100%",
    height: "100%",
    playerVars: {
      rel: 0,
      modestbranding: 1,
      autoplay: 1,
      playsinline: 1,
      listType: "playlist",
      list: playlistId,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: function (event) {
        console.error("❌ YouTube Player Error:", event.data);
      },
    },
  });
};

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    const videoData = player.getVideoData();
    const currentVideoId = videoData.video_id;
    if (isFirstPlay) {
      isFirstPlay = false;
    }
    highlightItemByVideoId(currentVideoId);
  }
}

function highlightItemByVideoId(videoId) {
  if (!items || items.length === 0) {
    console.warn("⚠️ items порожній або не ініціалізований");
    return;
  }

  const wrapper = document.querySelector(".col-list_wrapper");

  items.forEach((item) => {
    const id = item.querySelector(".text-invible")?.textContent?.trim();
    if (id === videoId) {
      items.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      if (window.innerWidth > 991 && wrapper) {
        const offsetTop =
          item.getBoundingClientRect().top -
          wrapper.getBoundingClientRect().top;
        wrapper.scrollTo({
          top: offsetTop + wrapper.scrollTop,
          behavior: "smooth",
        });
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  items = document.querySelectorAll(".col-item");

  // Завантажуємо прев'ю
  items.forEach((item) => {
    const videoId = item.querySelector(".text-invible")?.textContent?.trim();
    const img = item.querySelector("img");
    if (videoId && img) {
      img.src = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
    }
  });

  // Перевіряємо чи API вже завантажено
  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
  }

  // Кліки на елементи
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const videoId = item.querySelector(".text-invible")?.textContent?.trim();

      if (videoId && player) {
        player.loadVideoById(videoId);
        items.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");

        const wrapper = document.querySelector(".col-list_wrapper");
        if (window.innerWidth <= 991) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (wrapper) {
          const offsetTop =
            item.getBoundingClientRect().top -
            wrapper.getBoundingClientRect().top;
          wrapper.scrollTo({
            top: offsetTop + wrapper.scrollTop,
            behavior: "smooth",
          });
        }
      } else {
        console.error(
          "❌ Не можу програти відео. videoId:",
          videoId,
          "player:",
          player,
        );
      }
    });
  });
});
