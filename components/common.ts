export function formattedString(string: string) {
    // Split the string on underscores while preserving word boundaries
    const words = string.split(/_(?=\w)/);

    // Convert the first letter of each word to uppercase
    const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

    // Join the words with spaces
    return titleCaseWords.join(' ');
}

export function getTheCurrentBreakpoint() {
    switch (Number(window.getComputedStyle(document.querySelector('#root') as HTMLElement).getPropertyValue('z-index'))) {
        case 1:
            return 'medium';
        case 2:
            return 'large';
        default:
            return 'small';
    }
}

export function appendAnOverlayIfNecessary() {
    const existingOverlay = document.querySelector('.overlay');

    if (!existingOverlay) {
        const overlay = document.createElement('div');
        overlay?.classList.add('overlay');
        overlay?.classList.add('hidden');
        document.querySelector('#root')?.appendChild(overlay);
    }
}

export function toggleElementEnablement(selectors: any, enable = true) {
    const arraySelectors = Array.isArray(selectors) ? selectors : [selectors];

    arraySelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector),
            eventHandlers: { [key: string]: (event: any) => any } = {
                click: (event: any) => event.preventDefault(),
                keydown: (event: any) => event.preventDefault(),
                scroll: (event: any) => event.preventDefault()
            };

        elements.forEach((element: HTMLElement) => {

            if (enable) {
                if (element.id.includes('table-container')) element?.classList.remove('hidden-overflow-breakpoint0')
                else element?.classList.remove('faded');

                Object.keys(eventHandlers).forEach((event) => {
                    element.removeEventListener(event, eventHandlers[event]);
                });
            }

            else {

                if (element.id.includes('table-container')) element?.classList.add('hidden-overflow-breakpoint0')
                else element?.classList.add('faded');

                Object.keys(eventHandlers).forEach((event) => {
                    element.addEventListener(event, eventHandlers[event]);
                });

            }

        });
    });
}

export function repositionTheDataPanel() {
    const dataPanel = document.querySelector('.data-panel') as HTMLElement;
    if (dataPanel) dataPanel.style.marginTop = -dataPanel.offsetHeight / 2 + 'px';
}