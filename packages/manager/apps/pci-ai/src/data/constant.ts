import { ai } from "@/models/types"

export function displaySizeFormat (bytes: any, si = false, dp = 1) {
    // param si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
    // param dp Number of decimal places to display.
    const thresh = si ? 1000 : 1024
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B'
    }
    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    let u = -1
    const r = 10 ** dp
    do {
        bytes /= thresh
        ++u
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)
    return bytes.toFixed(dp) + ' ' + units[u]
}

export function formattedDuration (duration : number, wrap : boolean) {
    let remainingSeconds = duration;

    const months = Math.floor(remainingSeconds / (30 * 24 * 60 * 60));
    remainingSeconds -= months * 30 * 24 * 60 * 60;
  
    const days = Math.floor(remainingSeconds / (24 * 60 * 60));
    remainingSeconds -= days * 24 * 60 * 60;
  
    const hours = Math.floor(remainingSeconds / (60 * 60));
    remainingSeconds -= hours * 60 * 60;
  
    const minutes = Math.floor(remainingSeconds / 60);
    remainingSeconds -= minutes * 60;
    if (wrap) {
        const formattedDuration = [
            months > 0 && `${months}m`,
            days > 0 && `${days}d`,
            hours > 0 && `${hours}h`,
            minutes > 0 && `${minutes}mn`,
            remainingSeconds > 0 && `${remainingSeconds}s`
          ].filter(Boolean).join('');
          return formattedDuration || '0mn';
    }else{
        const formattedDuration = [
            months > 0 && `${months} mois`,
            days > 0 && `${days} jours`,
            hours > 0 && `${hours} heures`,
            minutes > 0 && `${minutes} minutes`,
            remainingSeconds > 0 && `${remainingSeconds} secondes`
          ].filter(Boolean).join(', ');
        
          return formattedDuration || 'moins d\'une seconde';
    }
}

export function formattedTokenRole (tokenRole : ai.TokenRoleEnum) {
    if (tokenRole === ai.TokenRoleEnum.ai_training_operator) {
        return "AI Platform - Operator";
    }else if (tokenRole === ai.TokenRoleEnum.ai_training_read) {
        return "AI Platform - Read Only"
    }
}
