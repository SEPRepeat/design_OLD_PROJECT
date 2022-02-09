let builder = document.getElementById("builder");

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

let login = getUrlParameter("login");
let name_bot = "";
$.getJSON('/builder?json=true&login=' + login, function(config){
    $.each( config, function( key, val ) {
        console.log(key, ":", val);
    });
    bot_name = config.name;
});

// Top builder
let btnBlock = document.getElementById("top__builder__btnBlock");
function changeStartInput() {
    let startInput = document.getElementById("startBotInput");
    startInput.remove();
    btnBlock.insertAdjacentHTML('beforeEnd', "<input class='stopInput' id='stopBotInput' type='submit' value='Остановить' onclick='changeStopInput()'>");
    $.post('/start', {'login': login, 'name': bot_name});
}

function changeStopInput() {
    let stopInput = document.getElementById("stopBotInput");
    stopInput.remove();
    btnBlock.insertAdjacentHTML('beforeEnd', "<input class='startInput' id='startBotInput' type='submit' value='Запустить' onclick='changeStartInput()'>");
    $.post('/stop', {'login': login, 'name': bot_name});
}

let platform="discord";
let pattern="music";
// BotCreate сreateModal
let createModal = document.getElementById("createModal");
let createInput = document.getElementById("createInput");
createInput.onclick = function showCreateModal() {
    createModal.style.cssText = "display: block;";
    //     createModal.style.cssText = "transition: opacity 0.4s, visibility 0.4s; opacity: 1; visibility: visible;";
}
let createModalClose = document.getElementById("create__modal__close");
createModalClose.onclick = function hideCreateModal() {
    createModal.style.cssText = "display: none;";
}

// BotCreate settingModal
let settingModal = document.getElementById("settingModal");
let discordBtn = document.getElementById("discordBtn");
discordBtn.onclick = function showSettingModal() {
    createModal.style.cssText = "display: none;";
    settingModal.style.cssText = "display: block;";
    platform="discord";
}
let settingBackBtn = document.getElementById("settingBackBtn");
settingBackBtn.onclick = function settingClose() {
    settingModal.style.cssText = "display: none;";
    createModal.style.cssText = "display: block;";
    previewImage.src = "";
}
let settingModalClose = document.getElementById("setting__modal__close");
settingModalClose.onclick = function hideSettingModal() {
    settingModal.style.cssText = "display: none;";
    previewImage.src = "";
}

// BotCreate platformModal
let bot_name = ""; 
let prefix = "";

let prefixBotInput = document.getElementById("prefixBotInput");
let nameBotInput = document.getElementById("nameBotInput");

let platformModal = document.getElementById("platformModal");
let settingContinueBtn = document.getElementById("settingContinueBtn");
settingContinueBtn.onclick = function showPlatformModal() {
    // checkSettingInput
    let prefixBotInputValue = document.getElementById("prefixBotInput").value;
    let nameBotInputValue = document.getElementById("nameBotInput").value;
    if(prefixBotInputValue == "") {
        alert("Вы не ввели префикс бота");
    } else {
        prefix = prefixBotInputValue;
        if(nameBotInputValue == "") {
            alert("Вы не ввели название бота");
        } else {
            bot_name = nameBotInputValue;
            if(window.image == undefined) {
                alert("Вы не загрузили аватарку бота");
            } else {
                settingModal.style.cssText = "display: none;";
                platformModal.style.cssText = "display: block;";
            }
        } 
    }
}


let settingIconBlock = document.getElementById("settingIconBlock");
// Preview
let previewImage = document.getElementById("previewImage");
function getImagePreview(event) {
    let image = URL.createObjectURL(event.target.files[0]);
    window.image = image;
    previewImage.src = image;
    previewImage.style.cssText = "width: 90px; height: 90px; border-radius: 45px;";
    var form_data = new FormData();
    form_data.append('file', event.target.files[0]);
    form_data.append('username', login);
    $.ajax({
            type: 'POST',
            url: '/img',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                console.log('Success!');
            },
    });

}

let platformBackBtn = document.getElementById("platformBackBtn");
platformBackBtn.onclick = function platformClose() {
    platformModal.style.cssText = "display: none;";;
    settingModal.style.cssText = "display: block;";
}
let platformModalClose = document.getElementById("platform__modal__close");
platformModalClose.onclick = function hidePlatformModal() {
    platformModal.style.cssText = "display: none;";
}
// BotCreate confirmModal
let confirmModal = document.getElementById("confirmModal");
let template = document.getElementById("template");
template.onclick = function showConfirmModal() {
    platformModal.style.cssText = "display: none;";
    confirmModal.style.cssText = "display: block;";
    pattern = "music";
}
let confirmBackBtn = document.getElementById("confirmBackBtn");
confirmBackBtn.onclick = function confirmClose() {
    confirmModal.style.cssText = "display: none;";
    platformModal.style.cssText = "display: block;";
}
let confirmModalClose = document.getElementById("confirm__modal__close");
confirmModalClose.onclick = function hideConfirmModal() {
    confirmModal.style.cssText = "display: none;";
}


// insertTemplate
let elastic = document.getElementById("elastic");

// allowTemplate && getAllow
let allowMusicTemplate = false;

// musicTemplate
let musicTemplate = document.getElementById("musicTemplate");
musicTemplate.onclick = function getAllow() {
    allowMusicTemplate = true;
}

let allowPlay = true;
let allowSkip = true;
let allowBack = true;

// CommandCreate addModal
let addModal = document.getElementById("addModal");
let addCommandInput = document.getElementById("addCommandInput");
let addModalClose = document.getElementById("add__modal__close");
addModalClose.onclick = function hideAddModal() {
    addModal.style.cssText = "display: none;";
}

let commandNames = [];
// Check allow && insert
let confirmModalInput = document.getElementById("confirmModalInput");
confirmModalInput.onclick = function checkAllow() {
    $.post('/create', {'login': login, 'name': bot_name, 'prefix': prefix, "platform": platform, "pattern": pattern});

    // CreateBot
    let newBot = document.createElement("div");
    let botContent = document.getElementById("botContent");
    botContent.appendChild(newBot);
    newBot.classList.add("botItem");
    
    let botIcon = document.createElement("img");
    newBot.appendChild(botIcon);
    botIcon.classList.add("botIcon");
    botIcon.src = image;
    window.image = undefined;

    previewImage.src = "";
    prefixBotInput.value = "";
    nameBotInput.value = "";
    
    confirmModal.style.cssText = "display: none;";
    //Check Music
    if(allowMusicTemplate = true) {

        builder.insertAdjacentHTML('beforeEnd', "<div class='builder__block d-flex' id='builder__block__back'> <div class='builder__block__prefix d-flex'> <p class='builder__prefix' id='helpPrefixBlock'></p> </div> <div class='builder__block__content'> <p class='builder__content__title'>[help] help video/music</p> </div> <div class='builder__block__help' id='trigger1'> <p class='builder__help d-flex justify-content-center' id='builder__toggle__hepl' onclick='showDescriptionHelp()'>V</p> </div> <div class='builder__block__dart'> <p class='builder__dart d-flex justify-content-center' id='builder__dart' onclick='deleteCommandHelp()'>&times;</p> </div> </div> <ul class='none hiddenInfo' id='descriptionHelp'> <p class='hiddenInfo__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </ul>");
        elastic.insertAdjacentHTML('beforeEnd', '<li class="elastic__item" id="play"> <a class="elastic__item__title" href="#">[play] play video/music</a> <p class="elastic__item__description">Позволяет боту воспроизводить музыку или видео</p> </li> <li class="elastic__item" id="skip"> <a class="elastic__item__title" href="#">[skip] skip video/music</a> <p class="elastic__item__description">Позволяет боту скипать музыку или видео</p> </li> <li class="elastic__item" id="back"> <a class="elastic__item__title" href="#">[back] back video/music</a> <p class="elastic__item__description">Позволяет боту скипать музыку или видео</p> </li> <li class="elastic__item" id="Тест"> <a class="elastic__item__title" href="#">[Тест] Тест Тест/Тест</a> <p class="elastic__item__description">Тест боту Тест музыку или Тест!</p> </li> <li class="elastic__item" id="Тест"> <a class="elastic__item__title" href="#">[Тест] Тест Тест/Тест</a> <p class="elastic__item__description">Тест боту Тест музыку или Тест!</p> </li> <li class="elastic__item" id="Тест"> <a class="elastic__item__title" href="#">[Тест] Тест Тест/Тест</a> <p class="elastic__item__description">Тест боту Тест музыку или Тест!</p> </li> <li class="elastic__item" id="Тест"> <a class="elastic__item__title" href="#">[Тест] Тест Тест/Тест</a> <p class="elastic__item__description">Тест боту Тест музыку или Тест!</p> </li> <li class="elastic__item" id="Тест"> <a class="elastic__item__title" href="#">[Тест] Тест Тест/Тест</a> <p class="elastic__item__description">Тест боту Тест музыку или Тест!</p> </li> <li class="elastic__item" id="Тест"> <a class="elastic__item__title" href="#">[Тест] Тест Тест/Тест</a> <p class="elastic__item__description">Тест боту Тест музыку или Тест!</p> </li> <li class="elastic__item" id="Тест"> <a class="elastic__item__title" href="#">[Тест] Тест Тест/Тест</a> <p class="elastic__item__description">Тест боту Тест музыку или Тест!</p> </li> <li class="elastic__item"><a class="elastic__item__title href="#">aaaaa</a></li> <li class="elastic__item"><a class="elastic__item__title href="#">ebeeebebe</a></li>');

        allowMusicTemplate = false;

        let play = document.getElementById("play");
        let skip = document.getElementById("skip");
        let back = document.getElementById("back");
        let save = document.getElementById("saveInput");

        play.onclick = function showPlay() {
            if(allowPlay == true) {
                addModal.style.cssText = "display: block;";
                //builder.insertAdjacentHTML('beforeEnd', "<div class='builder__block d-flex' id='builder__block__play'> <div class='builder__block__prefix d-flex'> <p class='builder__prefix' id='playPrefixBlock'></p> </div> <div class='builder__block__content'> <p class='builder__content__title'>[play] play video/music</p> </div> <div class='builder__block__help' id='trigger1'> <p class='builder__help d-flex justify-content-center' id='builder__toggle__play' onclick='showDescriptionPlay()'>V</p> </div> <div class='builder__block__dart'> <p class='builder__dart d-flex justify-content-center' id='builder__dart' onclick='deleteCommandPlay()'>&times;</p> </div> </div> <ul class='none hiddenInfo' id='descriptionPlay'> <p class='hiddenInfo__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </ul>");
                addCommandInput.onclick = function addCommandToBuilder() {
                    builder.insertAdjacentHTML('beforeEnd', "<div class='builder__block d-flex' id='builder__block__play'> <div class='builder__block__prefix d-flex' contenteditable='true' > <p class='builder__prefix' id='playPrefixBlock'></p> </div> <div class='builder__block__content'> <p class='builder__content__title'>[play] play video/music</p> </div> <div class='builder__block__help' id='trigger1'> <p class='builder__help d-flex justify-content-center' id='builder__toggle__play' onclick='showDescriptionPlay()'>V</p> </div> <div class='builder__block__dart'> <p class='builder__dart d-flex justify-content-center' id='builder__dart' onclick='deleteCommandPlay()'>&times;</p> </div> </div> <ul class='none hiddenInfo' id='descriptionPlay'> <p class='hiddenInfo__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </ul>");
                    addModal.style.cssText = "display: none;";

                    allowPlay = false;

                    //Playprefix
                    let commandNameInput = document.getElementById("commandNameInput");
                    let playPrefixBlock = document.getElementById("playPrefixBlock");
                    playPrefixBlock.innerHTML = commandNameInput.value;

                    commandNameInput.value = "";
                }
            }
        }

        skip.onclick = function showSkip() {
            if(allowSkip == true) {
                addModal.style.cssText = "display: block;";
                //builder.insertAdjacentHTML('beforeEnd', "<div class='builder__block d-flex' id='builder__block__skip'> <div class='builder__block__prefix d-flex'> <p class='builder__prefix' id='prefixBlock'></p> </div> <div class='builder__block__content'> <p class='builder__content__title'>[skip] skip video/music</p> </div> <div class='builder__block__help' id='trigger1'> <p class='builder__help d-flex justify-content-center' id='builder__toggle__skip' onclick='showDescriptionSkip()'>V</p> </div> <div class='builder__block__dart'> <p class='builder__dart d-flex justify-content-center' id='builder__dart' onclick='deleteCommandSkip()'>&times;</p> </div> </div> <ul class='none hiddenInfo' id='descriptionSkip'> <p class='hiddenInfo__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </ul>");
                addCommandInput.onclick = function addCommandToBuilder() {
                    builder.insertAdjacentHTML('beforeEnd', "<div class='builder__block d-flex' id='builder__block__back'> <div class='builder__block__prefix d-flex' contenteditable='true' > <p class='builder__prefix' id='skipPrefixBlock'></p> </div> <div class='builder__block__content'> <p class='builder__content__title'>[skip] skip video/music</p> </div> <div class='builder__block__help' id='trigger1'> <p class='builder__help d-flex justify-content-center' id='builder__toggle__back' onclick='showDescriptionBack()'>V</p> </div> <div class='builder__block__dart'> <p class='builder__dart d-flex justify-content-center' id='builder__dart' onclick='deleteCommandBack()'>&times;</p> </div> </div> <ul class='none hiddenInfo' id='descriptionBack'> <p class='hiddenInfo__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </ul>");
                    addModal.style.cssText = "display: none;";

                    allowSkip = false;

                    //Skipprefix
                    let commandNameInput = document.getElementById("commandNameInput");
                    let skipPrefixBlock = document.getElementById("skipPrefixBlock");
                    skipPrefixBlock.innerHTML = commandNameInput.value;

                    commandNameInput.value = "";
                }
            }
        }

        back.onclick = function showBack() {
            if(allowBack == true) {
                addModal.style.cssText = "display: block;";
                commandNameInputValue = "";
                //builder.insertAdjacentHTML('beforeEnd', "<div class='builder__block d-flex' id='builder__block__back'> <div class='builder__block__prefix d-flex'> <p class='builder__prefix' id='prefixBlock'></p> </div> <div class='builder__block__content'> <p class='builder__content__title'>[back] back video/music</p> </div> <div class='builder__block__help' id='trigger1'> <p class='builder__help d-flex justify-content-center' id='builder__toggle__back' onclick='showDescriptionBack()'>V</p> </div> <div class='builder__block__dart'> <p class='builder__dart d-flex justify-content-center' id='builder__dart' onclick='deleteCommandBack()'>&times;</p> </div> </div> <ul class='none hiddenInfo' id='descriptionBack'> <p class='hiddenInfo__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </ul>");
                addCommandInput.onclick = function addCommandToBuilder() {
                    builder.insertAdjacentHTML('beforeEnd', "<div class='builder__block d-flex' id='builder__block__skip'> <div class='builder__block__prefix d-flex' contenteditable='true' > <p class='builder__prefix' id='backPrefixBlock'></p> </div> <div class='builder__block__content'> <p class='builder__content__title'>[back] back video/music</p> </div> <div class='builder__block__help' id='trigger1'> <p class='builder__help d-flex justify-content-center' id='builder__toggle__skip' onclick='showDescriptionSkip()'>V</p> </div> <div class='builder__block__dart'> <p class='builder__dart d-flex justify-content-center' id='builder__dart' onclick='deleteCommandSkip()'>&times;</p> </div> </div> <ul class='none hiddenInfo' id='descriptionSkip'> <p class='hiddenInfo__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </ul>");
                    addModal.style.cssText = "display: none;";

                    allowBack = false;

                    //Backprefix
                    let commandNameInput = document.getElementById("commandNameInput");
                    let backPrefixBlock = document.getElementById("backPrefixBlock");
                    backPrefixBlock.innerHTML = commandNameInput.value;

                    commandNameInput.value = "";
                }
            }
        }

        save.onclick = function Save(){
            $.post('/save', {'play': allowPlay, 'skip': allowSkip, 'back': allowBack, 'prefix': prefix, 'login': login, 'name': bot_name});
        }
    }

}




//Check noMusic
//Help
function showDescriptionHelp() {
    let descriptionHelp = document.getElementById("descriptionHelp");
    let builderToggleHelp = document.getElementById("builder__toggle__help");
    descriptionHelp.classList.toggle("show");
    builderToggleHelp.classList.toggle("rotate180");
}
function deleteCommandHelp() {
    let builderBlockHelp = document.getElementById("builder__block__help");
    builderBlockHelp.remove();
    descriptionHelp.remove();
    allowHelp = true;
}
// Play
function deleteCommandPlay() {
    let builderBlockPlay = document.getElementById("builder__block__play");
    builderBlockPlay.remove();
    descriptionPlay.remove();
    allowPlay = true;
}
function showDescriptionPlay() {
    let descriptionPlay = document.getElementById("descriptionPlay");
    let builderTogglePlay = document.getElementById("builder__toggle__play");
    descriptionPlay.classList.toggle("show");
    builderTogglePlay.classList.toggle("rotate180");
}
// Skip
function deleteCommandSkip() {
    let builderBlockSkip = document.getElementById("builder__block__skip");
    builderBlockSkip.remove();
    descriptionSkip.remove();
    allowSkip = true;
}
function showDescriptionSkip() {
    let descriptionSkip = document.getElementById("descriptionSkip");
    let builderToggleSkip = document.getElementById("builder__toggle__skip");
    descriptionSkip.classList.toggle("show");
    builderToggleSkip.classList.toggle("rotate180")
}
// Back
function deleteCommandBack() {
    let builderBlockBack = document.getElementById("builder__block__back");
    addCommandInput.classList.remove("playCommand");
    builderBlockBack.remove();
    descriptionBack.remove();
    allowBack = true;
}
function showDescriptionBack() {
    let descriptionBack = document.getElementById("descriptionBack");
    let builderToggleBack = document.getElementById("builder__toggle__back");
    descriptionBack.classList.toggle("show");
    builderToggleBack.classList.toggle("rotate180");
}
