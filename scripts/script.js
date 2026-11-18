const createElement = (arr) => {
    const htmlElement = arr.map((ele) => `<span class="btn">${ele}</span>`);
    return htmlElement.join(" ");
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
};

const loadLesson = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    fetch(url)
        .then((res) => res.json())
        .then((lesion) => displayLesson(lesion.data));
};

const removeActive = () => {
    const removeButtons = document.querySelectorAll(".lesson-btn");
    removeButtons.forEach((btn) => {
        btn.classList.remove("active");
    });
};

const loadLevelWord = (id) => {
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((word) => {
            removeActive(); // remove all active class
            const clickBtn = document.getElementById(`lesson-btn-${id}`); // dd
            clickBtn.classList.add("active");

            displayLevelWord(word.data);
        });
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    wordDisplayDetails(details.data);
};

const wordDisplayDetails = (words) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    <div class="">
            <h2 class="text-2xl font-bold">${words.word} ( <i class="fa-solid fa-microphone-lines"></i> :<span>${words.pronunciation}</span>)</h2>
        </div>
        <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${words.meaning}</p>
        </div>
        <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${words.sentence}</p>
        </div>
        <div class="">
            <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
            <div class="">
            ${createElement(words.synonyms)}
            
        </div>
        </div>
    
    
    `;

    document.getElementById("my_modal_5").showModal();
};

const displayLevelWord = (words) => {
    manageSpinner(true);
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-4">
            <img class="mx-auto" src="./assets/alert-error.png"></img>
            <p class="text-sm font-medium text-gray-500"> এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি। </p>
            <h2 class="text-3xl font-bold">নেক্সট Lesson এ যান</h2>

           </div>
        
        `;
        manageSpinner(false);
        return;
    }

    words.map((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
        
         <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
                <h2 class="font-bold text-xl">${word.word}</h2>
                <p class="font-semibold">Meaning /Pronounciation</p>
                <div class="font-bangla text-2xl font-medium">"${word.meaning} / ${word.pronunciation}"</div>
                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume"></i></button>

                </div>

            </div>
        
        `;
        wordContainer.append(card);
    });
    manageSpinner(false);
};

const displayLesson = (items) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    items.map((item) => {
        // console.log(item);
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `

         <button id="lesson-btn-${item.level_no}" onclick="loadLevelWord(${item.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${item.level_no}</button>
        `;
        levelContainer.append(btnDiv);
    });
};

loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchInput = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            const filterWord = allWords.filter((word) =>
                word.word.toLowerCase().includes(searchInput),
            );
            displayLevelWord(filterWord);
        });
});
