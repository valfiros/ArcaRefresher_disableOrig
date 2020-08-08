import * as DateManager from './datemanager';
import * as BlockSystem from './blocksystem';
import * as Setting from './setting';

export function applyRefreshBtn() {
    const btn = (
        <span>
            <span>　</span>
            <button class="btn btn-success">
                <span class="icon ion-android-refresh" />
                <span> 새로고침</span>
            </button>
        </span>
    );
    const clonebtn = btn.cloneNode(true);

    document.querySelector('.article-comment .title a').insertAdjacentElement('beforebegin', btn);
    document.querySelector('.article-comment .subtitle').append(clonebtn);

    async function onclick(event) {
        event.preventDefault();
        btn.disabled = true;
        clonebtn.disabled = true;
        await refresh();
        btn.disabled = false;
        clonebtn.disabled = false;
    }

    btn.addEventListener('click', onclick);
    clonebtn.addEventListener('click', onclick);
}

function refresh() {
    return new Promise((resolve) => {
        const req = new XMLHttpRequest();

        req.open('GET', window.location.href);
        req.responseType = 'document';
        req.addEventListener('load', () => {
            const newComments = req.response.querySelector('.article-comment .list-area');
            newComments.querySelectorAll('time').forEach(time => {
                time.innerText = DateManager.getDateStr(time.dateTime);
            });
            if(newComments) {
                const parent = document.querySelector('.article-comment');
                const list = parent.querySelector('.list-area');
                if(list) list.remove();
                parent.querySelector('.title').insertAdjacentElement('afterend', newComments);
                const items = newComments.querySelectorAll('.comment-item');
                BlockSystem.blockComment(items);
                BlockSystem.blockEmoticon(items);
                applyBlockBtn();
            }
            resolve();
        });
        req.send();
    });
}

export function applyBlockBtn() {
    const emoticons = document.querySelectorAll('.comment-item img, .comment-item video');

    emoticons.forEach(item => {
        const btn = <button class="btn btn-success block-emoticon" data-id="">차단</button>;

        btn.setAttribute('data-id', item.getAttribute('data-id'));
        item.parentNode.append(btn);
    });

    async function onClick(event) {
        if(event.target.tagName != 'BUTTON') return;
        if(!event.target.classList.contains('block-emoticon')) return;

        event.preventDefault();

        event.target.innerText = '차단 중...';
        event.target.disabled = true;
        const id = event.target.getAttribute('data-id');
        const title = await getEmoticonTitle(id);

        window.config.blockEmoticon[id] = title;
        Setting.save(window.config);
        location.reload();
    }

    document.querySelector('.article-comment').addEventListener('click', onClick);
}

function getEmoticonTitle(id) {
    return new Promise((resolve) => {
        const req = new XMLHttpRequest();

        req.open('GET', `/api/emoticon/shop/${id}`);
        req.responseType = 'document';
        req.addEventListener('load', () => {
            const name = req.response.querySelector('.article-head .title').innerText;
            resolve(name);
        });
        req.send();
    });
}
