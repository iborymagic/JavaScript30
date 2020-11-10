/* Get our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Build our functions */
function togglePlay() {
    if(video.paused) { // playing이라는 property는 없다. 'paused'만 있음.
        video.play();
    } else {
        video.pause();
    }
    /*
        // play나 pause 또한 video에 속한 하나의 메소드임을 이해하면 사용할 수 있는 방법.
        const method = video.paused ? 'play' : 'pause';
        video[method]();

        // 이런 것도 가능
        video[video.paused ? 'play' : 'pause']();
    */
}

function updateButton() {
    // 물론 togglePlay 함수 안에다가 버튼 모양을 바꾸는 로직을 넣어도 되긴 함.
    // 근데, 비디오를 pause하는 방법이 마우스 클릭만 있는 건 아님.
    // 그래서 비디오가 pause하는 이벤트 자체에 리스너를 붙여주는 게 좋다.
    
    // 이 리스너 자체가 video에 붙기 때문에, this가 video를 가리킨다.
    const icon = this.paused ? '►' : '❚❚';
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    // range input의 name을 video의 속성명과 동일하게 줬기 때문에 이런 코드가 가능한 것.
    video[this.name] = this.value;
}

function handleProgress() {
    // 현재 progress bar의 길이는 'flex-basis' 속성으로 조절되고 있음.
    // 그래서 이 flex-basis를 퍼센트로 조절해줌으로써 길이를 조절할 예정
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    // progress bar가 relative로 설정되어있어서, offsetX 속성도 전체 X 중에 어느 정도 X 지점을 클릭했는지를 나타내게 된다.
    // 전체 progress bar의 길이는 offsetWidth를 통해 가져올 수 있다.
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
// 버튼을 놓지 않고 움직이는 도중에도 변화가 실시간으로 적용되어야 함.
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
// 마우스를 누르고 있지 않은데도 영상이 이동해버림
// progress.addEventListener('mousemove', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); 
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// 전체화면 버튼도 만들어보기