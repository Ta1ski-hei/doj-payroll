const WorkType = require('../models/WorkType');

const initializeWorkTypes = async () => {
  const workTypes = [
    {
      category: 'ADMINISTRATIVE',
      type: 'Administrativní/sekretářské',
      minPay: 800,
      maxPay: 2100,
      keywords: ['administrativa', 'administrace', 'sekretářské', 'dokumentace', 'archivace', 'mailová komunikace', 'email']
    },
    {
      category: 'PROSECUTION',
      type: 'Státní zastupitelství/crd dokumenty',
      minPay: 1500,
      maxPay: 2800,
      keywords: ['státní zastupitelství dokumenty', 'crd dokumenty', 'spis', 'vydání dokumentů']
    },
    {
      category: 'PROSECUTION',
      type: 'Státní zastupitelství/crd poradenství',
      minPay: 1800,
      maxPay: 5500,
      keywords: ['státní zastupitelství poradenství', 'crd poradenství', 'konzultace', 'porada', 'poradenstvo']
    },
    {
      category: 'PROSECUTION',
      type: 'Státní zastupitelství/crd žaloby',
      minPay: 2750,
      maxPay: 6500,
      keywords: ['státní zastupitelství žaloba', 'crd žaloba', 'obžaloba', 'žaloba', 'spísanie obžaloby']
    },
    {
      category: 'COURT',
      type: 'Soud - dokumenty',
      minPay: 1800,
      maxPay: 3800,
      keywords: [
        'soud - dokumenty',
        'soudní dokumentace',
        'vydání dokumentů',
        'vypísanie dokumentu',
        'vydanie dokumentov'
      ]
    },
    {
      category: 'COURT',
      type: 'Soud - poradenství',
      minPay: 2500,
      maxPay: 6000,
      keywords: [
        'soud - poradenství',
        'soud - poradenstvo',
        'soud poradenství',
        'soud poradenstvo',
        'soudní poradenství',
        'poradenstvo ohladne',
        'informovanie ohladne',
        'konzultace o postupoch',
        'konzultácia ohladne',
        'porada o',
        'poradenstvo o',
        'poradenstvo',
        'poradentstvo',
        'konzultácia',
        'konzultace',
        'informovanie',
        'informování'
      ]
    },
    {
      category: 'COURT_HEARING',
      type: 'Soudní líčení SZ - veřejné',
      minPay: 13000,
      maxPay: 16000,
      keywords: ['soudní líčení sz veřejné', 'veřejné líčení sz', 'státní zástupce veřejné', 'veřejné jednání sz']
    },
    {
      category: 'COURT_HEARING',
      type: 'Soudní líčení Soudce - veřejné',
      minPay: 15000,
      maxPay: 23000,
      keywords: ['soudní líčení soudce veřejné', 'veřejné líčení soudce', 'soudce veřejné']
    },
    {
      category: 'COURT_HEARING',
      type: 'Soudní líčení SZ - neveřejné',
      minPay: 8500,
      maxPay: 13000,
      keywords: ['soudní líčení sz neveřejné', 'neveřejné líčení sz', 'státní zástupce neveřejné']
    },
    {
      category: 'COURT_HEARING',
      type: 'Soudní líčení Soudce - neveřejné',
      minPay: 11000,
      maxPay: 18000,
      keywords: ['soudní líčení soudce neveřejné', 'neveřejné líčení soudce']
    },
    {
      category: 'PUBLIC_DEFENDER',
      type: 'Public Defender řešení',
      minPay: 3000,
      maxPay: 7000,
      keywords: ['public defender', 'obhájce', 'veřejný obhájce']
    },
    {
      category: 'MEDIA',
      type: 'Grafické a editorské práce',
      minPay: 2500,
      maxPay: 13000,
      keywords: ['grafika', 'grafické práce', 'editace', 'editorské práce']
    },
    {
      category: 'MEDIA',
      type: 'Práce tiskového mluvčího',
      minPay: 1500,
      maxPay: 9500,
      keywords: ['tiskový mluvčí', 'tisková zpráva', 'tiskové']
    },
    {
      category: 'MEDIA',
      type: 'Práce Social Managera',
      minPay: 2000,
      maxPay: 2000,
      keywords: ['social manager', 'sociální sítě', 'příspěvek']
    },
    {
      category: 'STATE_BAR',
      type: 'State Bar zkouška písemná',
      minPay: 1500,
      maxPay: 1500,
      keywords: ['state bar písemná', 'písemná zkouška', 'bar písemná']
    },
    {
      category: 'STATE_BAR',
      type: 'State Bar zkouška ústní',
      minPay: 4000,
      maxPay: 4000,
      keywords: ['state bar ústní', 'ústní zkouška', 'bar ústní']
    },
    {
      category: 'STATE_BAR',
      type: 'State Bar obepsání',
      minPay: 1000,
      maxPay: 1000,
      keywords: ['state bar obepsání', 'bar obepsání']
    },
    {
      category: 'RECRUITMENT',
      type: 'Nábor osoby obepsání',
      minPay: 800,
      maxPay: 800,
      keywords: ['nábor obepsání', 'nábor osoby']
    },
    {
      category: 'RECRUITMENT',
      type: 'Nábor osoby interviewer',
      minPay: 2000,
      maxPay: 2000,
      keywords: ['nábor interview', 'interviewer', 'pohovor']
    }
  ];

  for (const workType of workTypes) {
    await WorkType.findOneAndUpdate(
      { type: workType.type },
      workType,
      { upsert: true, new: true }
    );
  }
};

// Funkce pro extrakci času ze zprávy
function extractTimeRange(message) {
  // Hledáme vzory jako "19:05 - 20:05" nebo "19:05-20:05"
  const timePattern = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
  const match = message.match(timePattern);
  
  if (!match) return null;

  const [_, startTime, endTime] = match;
  
  // Převedeme časy na minuty
  const getMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = getMinutes(startTime);
  const endMinutes = getMinutes(endTime);
  
  // Pokud končíme druhý den (např. 23:00 - 01:00)
  const duration = endMinutes < startMinutes 
    ? (24 * 60 - startMinutes) + endMinutes
    : endMinutes - startMinutes;

  return {
    startTime,
    endTime,
    duration // v minutách
  };
}

// Funkce pro výpočet odměny na základě času
function calculatePayByDuration(baseMin, baseMax, durationMinutes, category) {
  // Speciální pravidla pro administrativní práci
  if (category === 'ADMINISTRATIVE') {
    const MAX_ADMIN_DURATION = 60;  // 1 hodina pro administrativu
    const MIN_DURATION = 15;        // 15 minut minimum pro administrativu

    if (durationMinutes < MIN_DURATION) {
      return baseMin;
    }

    if (durationMinutes >= MAX_ADMIN_DURATION) {
      return baseMax;
    }

    const ratio = (durationMinutes - MIN_DURATION) / (MAX_ADMIN_DURATION - MIN_DURATION);
    return baseMin + (baseMax - baseMin) * ratio;
  }

  // Pro ostatní typy práce původní logika
  const MAX_DURATION = 210; // 3.5 hodiny
  const MIN_DURATION = 30;  // 30 minut minimum

  if (durationMinutes < MIN_DURATION) {
    return baseMin;
  }

  if (durationMinutes >= MAX_DURATION) {
    return baseMax;
  }

  const ratio = (durationMinutes - MIN_DURATION) / (MAX_DURATION - MIN_DURATION);
  return baseMin + (baseMax - baseMin) * ratio;
}

// Upravená funkce pro analýzu zprávy
const analyzeMessage = async (message) => {
  const workTypes = await WorkType.find();
  
  // Vylepšené čištění zprávy
  const cleanMessage = message
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Odstraní emoji
    .replace(/^Práce:\s*/i, '')             // Odstraní "Práce: "
    .replace(/\s+/g, ' ')                   // Nahradí více mezer jednou
    .trim();
    
  console.log('Očištěná zpráva:', cleanMessage); // Pro debugging
  
  const messageLower = cleanMessage.toLowerCase();
  
  // Přímá kontrola pro "soud - poradentství"
  if (messageLower.startsWith('soud - poradentství') || 
      messageLower.startsWith('soud - poradenství') ||
      messageLower.startsWith('soud - poradenstvo')) {
    const courtAdvice = workTypes.find(wt => wt.type === 'Soud - poradenství');
    if (courtAdvice) {
      const timeRange = extractTimeRange(message);
      const pay = timeRange 
        ? calculatePayByDuration(courtAdvice.minPay, courtAdvice.maxPay, timeRange.duration, courtAdvice.category)
        : (courtAdvice.minPay + courtAdvice.maxPay) / 2;

      return {
        workType: courtAdvice.type,
        category: courtAdvice.category,
        pay: Math.round(pay),
        duration: timeRange ? timeRange.duration : null,
        timeRange: timeRange ? `${timeRange.startTime} - ${timeRange.endTime}` : null,
        minPay: courtAdvice.minPay,
        maxPay: courtAdvice.maxPay
      };
    }
  }

  // Přidáme další klíčová slova pro soudní poradenství
  const courtAdviceKeywords = [
    'soud - poradentství',
    'soud - poradenství',
    'soud - poradenstvo',
    'soud poradentství',
    'soud poradenství',
    'soud poradenstvo'
  ];

  // Kontrola přesné shody s klíčovými slovy
  if (courtAdviceKeywords.some(keyword => messageLower.includes(keyword))) {
    const courtAdvice = workTypes.find(wt => wt.type === 'Soud - poradenství');
    if (courtAdvice) {
      const timeRange = extractTimeRange(message);
      const pay = timeRange 
        ? calculatePayByDuration(courtAdvice.minPay, courtAdvice.maxPay, timeRange.duration, courtAdvice.category)
        : (courtAdvice.minPay + courtAdvice.maxPay) / 2;

      return {
        workType: courtAdvice.type,
        category: courtAdvice.category,
        pay: Math.round(pay),
        duration: timeRange ? timeRange.duration : null,
        timeRange: timeRange ? `${timeRange.startTime} - ${timeRange.endTime}` : null,
        minPay: courtAdvice.minPay,
        maxPay: courtAdvice.maxPay
      };
    }
  }

  // Pokud nenajdeme přesnou shodu, pokračujeme s původní logikou
  const sortedWorkTypes = [...workTypes].sort((a, b) => {
    const maxLengthA = Math.max(...a.keywords.map(k => k.length));
    const maxLengthB = Math.max(...b.keywords.map(k => k.length));
    return maxLengthB - maxLengthA;
  });

  let bestMatch = sortedWorkTypes.find(workType => 
    workType.keywords.some(keyword => 
      messageLower.includes(keyword.toLowerCase())
    )
  );

  if (!bestMatch) {
    let maxMatchScore = 0;
    sortedWorkTypes.forEach(workType => {
      workType.keywords.forEach(keyword => {
        const keywordParts = keyword.toLowerCase().split(' ');
        const matchScore = keywordParts.filter(part => 
          messageLower.includes(part)
        ).length / keywordParts.length;

        if (matchScore > maxMatchScore) {
          maxMatchScore = matchScore;
          bestMatch = workType;
        }
      });
    });

    if (maxMatchScore < 0.7) {
      bestMatch = null;
    }
  }

  if (!bestMatch) {
    return null;
  }

  // Extrahujeme časový rozsah
  const timeRange = extractTimeRange(message);
  let pay;

  if (timeRange) {
    // Přidáme kategorii do výpočtu
    pay = calculatePayByDuration(
      bestMatch.minPay,
      bestMatch.maxPay,
      timeRange.duration,
      bestMatch.category
    );
  } else {
    pay = (bestMatch.minPay + bestMatch.maxPay) / 2;
  }

  return {
    workType: bestMatch.type,
    category: bestMatch.category,
    pay: Math.round(pay), // Zaokrouhlíme na celá čísla
    duration: timeRange ? timeRange.duration : null,
    timeRange: timeRange ? `${timeRange.startTime} - ${timeRange.endTime}` : null,
    minPay: bestMatch.minPay,
    maxPay: bestMatch.maxPay
  };
};

module.exports = {
  initializeWorkTypes,
  analyzeMessage
}; 