import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Brain, Lock, MessageSquare, Search, Trophy, RotateCcw, Zap, Eye, ShieldAlert, Clock3, Lightbulb } from 'lucide-react';
import './styles.css';

const suspects = ['Aarav', 'Maya', 'Kabir', 'Ishika', 'Rohan', 'Nila', 'Dev', 'Anika', 'Vikram', 'Meera', 'Sana', 'Arjun', 'Priya', 'Neha', 'Kavin', 'Recruiter'];
const ranks = ['Rookie Reader', 'Clue Catcher', 'Contradiction Hunter', 'Truth Analyst', 'Elite Detective'];

const allCases = [
  {
    id: 1,
    title: 'Case 1: The Missing Earbuds',
    setting: 'College classroom after lunch break.',
    chat: ['Maya: I left class before lunch.', 'Aarav: I saw Maya near the last bench at 1:10.', 'Maya: Maybe I came back for my water bottle, not sure.'],
    clues: ['CCTV snapshot shows Maya entering class at 1:08.', 'The earbuds were last seen at 1:05.', 'Maya first denies entering, then gives a new reason.'],
    suspects: ['Maya', 'Aarav'],
    liar: 'Maya',
    truth: 'Maya returned to class and lied about it.',
    difficulty: 1,
    timer: null
  },
  {
    id: 2,
    title: 'Case 2: The Cafeteria Coupon',
    setting: 'A discount coupon was used before the owner arrived.',
    chat: ['Rohan: I never touched the coupon.', 'Nila: I saw Rohan near the billing counter.', 'Rohan: I was only asking the menu price.'],
    clues: ['The coupon code was redeemed from Rohan’s phone browser.', 'Billing counter camera shows Rohan scanning something.', 'Nila’s statement matches the timestamp.'],
    suspects: ['Rohan', 'Nila'],
    liar: 'Rohan',
    truth: 'Rohan used the coupon and lied about touching it.',
    difficulty: 1,
    timer: null
  },
  {
    id: 3,
    title: 'Case 3: Lab Attendance Trick',
    setting: 'A student claims she attended the lab session.',
    chat: ['Ishika: I was in lab from 2 to 4.', 'Kabir: I did not see Ishika during the experiment.', 'Ishika: I sat at the corner system.'],
    clues: ['System login record has no Ishika entry.', 'Lab photo at 2:45 shows the corner system empty.', 'Kabir submitted readings from the same batch.'],
    suspects: ['Ishika', 'Kabir'],
    liar: 'Ishika',
    truth: 'Ishika was not in the lab during the claimed time.',
    difficulty: 1,
    timer: null
  },
  {
    id: 4,
    title: 'Case 4: The Edited Payment Proof',
    setting: 'A friend claims a payment was already sent.',
    chat: ['Dev: I paid you in the morning.', 'Anika: Send the transaction SMS too.', 'Dev: SMS got deleted automatically.'],
    clues: ['Screenshot clock says 8:16, but phone status bar says 7:02.', 'UPI reference number format is incomplete.', 'Dev avoids opening the payment app live.'],
    suspects: ['Dev', 'Anika'],
    liar: 'Dev',
    truth: 'Dev edited the payment screenshot.',
    difficulty: 1,
    timer: null
  },
  {
    id: 5,
    title: 'Case 5: The Library Notebook',
    setting: 'A notebook disappeared near closing time.',
    chat: ['Anika: I was inside the library till 8.', 'Dev: Library closed at 7:30.', 'Anika: I meant near the library, not inside.'],
    clues: ['Library exit log shows Anika left at 7:12.', 'Notebook disappeared around 7:45.', 'Anika changes her location after being challenged.'],
    suspects: ['Anika', 'Dev'],
    liar: 'Anika',
    truth: 'Anika lied about where she was after 7:30.',
    difficulty: 1,
    timer: null
  },
  {
    id: 6,
    title: 'Case 6: The Project Upload',
    setting: 'A team file was submitted minutes before deadline.',
    chat: ['Kabir: I uploaded my part yesterday.', 'Ishika: Version history starts today at 8:41 PM.', 'Kabir: Maybe the platform glitched.'],
    clues: ['The first file version is from today.', 'Kabir asks what topic he was assigned.', 'His paragraph formatting matches Ishika’s draft.'],
    suspects: ['Kabir', 'Ishika'],
    liar: 'Kabir',
    truth: 'Kabir did not upload his work yesterday.',
    difficulty: 2,
    timer: null
  },
  {
    id: 7,
    title: 'Case 7: The Wrong Bus Stop',
    setting: 'A missed event because someone gave wrong directions.',
    chat: ['Maya: I sent the correct stop name.', 'Aarav: Your message says East Gate, not Main Gate.', 'Maya: Autocorrect changed it.'],
    clues: ['Autocorrect cannot change Main Gate to East Gate automatically.', 'Maya earlier searched East Gate location.', 'Aarav arrived exactly where her message pointed.'],
    suspects: ['Maya', 'Aarav'],
    liar: 'Maya',
    truth: 'Maya sent the wrong stop and blamed autocorrect.',
    difficulty: 2,
    timer: null
  },
  {
    id: 8,
    title: 'Case 8: Fake Recruiter Fee',
    setting: 'A job offer asks for certificate verification money.',
    chat: ['Recruiter: Pay ₹499 to confirm your interview.', 'Priya: Real companies do not ask interview fees.', 'Recruiter: This is urgent HR policy.'],
    clues: ['Email domain is misspelled by one letter.', 'The company site has no such opening.', 'Recruiter refuses a video call or official HR contact.'],
    suspects: ['Recruiter', 'Priya'],
    liar: 'Recruiter',
    truth: 'The recruiter message is a scam.',
    difficulty: 2,
    timer: null
  },
  {
    id: 9,
    title: 'Case 9: The Broken Charger',
    setting: 'A charger broke in the hostel room.',
    chat: ['Vikram: I never borrowed your charger.', 'Meera: I saw it on Vikram’s table.', 'Vikram: That was my own charger.'],
    clues: ['The broken cable has the owner’s sticker under the tape.', 'Vikram’s old charger is black, this one is white.', 'Meera’s photo shows the sticker corner.'],
    suspects: ['Vikram', 'Meera'],
    liar: 'Vikram',
    truth: 'Vikram borrowed the charger and denied it.',
    difficulty: 2,
    timer: null
  },
  {
    id: 10,
    title: 'Case 10: Assignment Timestamp',
    setting: 'A late assignment was claimed to be sent on time.',
    chat: ['Neha: I mailed it before midnight.', 'Kavin: The mail header shows 12:07 AM.', 'Neha: My laptop time was wrong.'],
    clues: ['Mail server timestamp cannot be changed by laptop clock.', 'The attachment was created at 12:03 AM.', 'Neha asks to ignore the header details.'],
    suspects: ['Neha', 'Kavin'],
    liar: 'Neha',
    truth: 'Neha submitted after midnight.',
    difficulty: 2,
    timer: null
  },
  {
    id: 11,
    title: 'Case 11: The Missing Lab Kit',
    setting: 'A lab kit vanished from a shared desk.',
    chat: ['Arjun: I left before the kit was placed there.', 'Sana: I saw Arjun sign the lab sheet after that.', 'Arjun: I signed it earlier, maybe the sheet order changed.'],
    clues: ['Lab sheet entries are time-locked.', 'Arjun signed at 3:22, kit arrived at 3:10.', 'A witness remembers Arjun holding a blue pouch.'],
    suspects: ['Arjun', 'Sana'],
    liar: 'Arjun',
    truth: 'Arjun was present after the kit arrived.',
    difficulty: 2,
    timer: null
  },
  {
    id: 12,
    title: 'Case 12: Canteen Wallet',
    setting: 'A wallet was found empty near the juice stall.',
    chat: ['Nila: I only returned the wallet.', 'Rohan: The cash was inside when I lost it.', 'Nila: Maybe someone else opened it first.'],
    clues: ['Juice stall camera shows Nila opening the wallet alone.', 'No other person touched it before return.', 'Nila bought snacks using cash immediately after.'],
    suspects: ['Nila', 'Rohan'],
    liar: 'Nila',
    truth: 'Nila removed the cash before returning the wallet.',
    difficulty: 2,
    timer: null
  },
  {
    id: 13,
    title: 'Case 13: The Deleted Voice Note',
    setting: 'A voice note caused confusion in a group plan.',
    chat: ['Meera: I never said the meeting was cancelled.', 'Priya: You deleted a voice note at 6:20.', 'Meera: It was just background noise.'],
    clues: ['Priya’s notification preview says “cancel today”.', 'Meera deleted the note after two people replied “okay”.', 'Meeting room booking was cancelled from Meera’s account.'],
    suspects: ['Meera', 'Priya', 'Kavin'],
    liar: 'Meera',
    truth: 'Meera cancelled the meeting and then denied it.',
    difficulty: 3,
    timer: 67
  },
  {
    id: 14,
    title: 'Case 14: The Exam Rumour',
    setting: 'A fake test postponement message spread fast.',
    chat: ['Kavin: I only forwarded what I received.', 'Neha: The original screenshot has your wallpaper.', 'Kavin: Many people use that wallpaper.'],
    clues: ['Screenshot notification bar shows Kavin’s custom SIM name.', 'The fake message was created before it appeared in any group.', 'Neha received it first from Kavin.'],
    suspects: ['Kavin', 'Neha', 'Aarav'],
    liar: 'Kavin',
    truth: 'Kavin created the fake postponement screenshot.',
    difficulty: 3,
    timer: 66
  },
  {
    id: 15,
    title: 'Case 15: The Stolen Design',
    setting: 'A poster design appears in another team’s submission.',
    chat: ['Priya: I made this layout myself.', 'Sana: My draft had the same hidden grid marks.', 'Priya: Those marks are common design guides.'],
    clues: ['Sana’s draft was saved two days earlier.', 'Priya’s file contains a hidden layer named Sana-v2.', 'Color values match Sana’s draft exactly.'],
    suspects: ['Priya', 'Sana', 'Dev'],
    liar: 'Priya',
    truth: 'Priya copied Sana’s design file.',
    difficulty: 3,
    timer: 65
  },
  {
    id: 16,
    title: 'Case 16: Taxi Fare Split',
    setting: 'A group ride fare was split unfairly.',
    chat: ['Aarav: The fare was ₹640, so everyone owes ₹160.', 'Maya: The app receipt says ₹520.', 'Aarav: Tip and waiting charge were extra.'],
    clues: ['Receipt includes tip and waiting charge already.', 'Aarav cropped the bottom of the screenshot.', 'The driver confirms total paid was ₹520.'],
    suspects: ['Aarav', 'Maya', 'Rohan'],
    liar: 'Aarav',
    truth: 'Aarav inflated the fare amount.',
    difficulty: 3,
    timer: 64
  },
  {
    id: 17,
    title: 'Case 17: The Spoiled Surprise',
    setting: 'A surprise event location leaked early.',
    chat: ['Sana: I did not tell anyone the venue.', 'Arjun: Your story had the cafe board reflection.', 'Sana: That photo was from last week.'],
    clues: ['The cafe had today’s decoration banner in the reflection.', 'Sana posted the story 20 minutes before the leak.', 'Arjun did not follow the private story account.'],
    suspects: ['Sana', 'Arjun', 'Meera'],
    liar: 'Sana',
    truth: 'Sana leaked the venue through her story.',
    difficulty: 3,
    timer: 63
  },
  {
    id: 18,
    title: 'Case 18: The Fake Apology',
    setting: 'A rude anonymous comment was traced.',
    chat: ['Vikram: I would never comment from a fake ID.', 'Dev: The fake ID used your usual phrase.', 'Vikram: Everyone says that phrase.'],
    clues: ['Fake account recovery email ends with Vikram’s initials.', 'The comment was posted from campus Wi-Fi during Vikram’s free hour.', 'The same typo appears in Vikram’s older posts.'],
    suspects: ['Vikram', 'Dev', 'Anika'],
    liar: 'Vikram',
    truth: 'Vikram used the fake account.',
    difficulty: 3,
    timer: 62
  },
  {
    id: 19,
    title: 'Case 19: The Conference Badge',
    setting: 'Someone entered an event using another person’s badge.',
    chat: ['Neha: I collected only my own badge.', 'Ishika: My badge was scanned at 9:18 before I arrived.', 'Neha: Maybe scanner data synced late.'],
    clues: ['Scanner logs sync instantly.', 'Neha entered at 9:18 wearing a covered badge.', 'Ishika arrived at 9:42 with cab receipt proof.'],
    suspects: ['Neha', 'Ishika', 'Kabir'],
    liar: 'Neha',
    truth: 'Neha used Ishika’s badge to enter early.',
    difficulty: 3,
    timer: 61
  },
  {
    id: 20,
    title: 'Case 20: The Muted Call',
    setting: 'A caller claims nobody answered during an emergency.',
    chat: ['Dev: I called three times, nobody picked up.', 'Anika: My call log shows only one missed call.', 'Dev: Network must have failed twice.'],
    clues: ['Dev’s screenshot shows two calls marked cancelled, not missed.', 'Cancelled calls were ended before ringing.', 'Anika’s phone was online at that time.'],
    suspects: ['Dev', 'Anika', 'Maya'],
    liar: 'Dev',
    truth: 'Dev did not actually let the calls ring.',
    difficulty: 3,
    timer: 60
  },
  {
    id: 21,
    title: 'Case 21: The Placement List',
    setting: 'A placement shortlist screenshot was leaked.',
    chat: ['Kabir: I got the list from a senior.', 'Maya: The file name has your roll number.', 'Kabir: I renamed it after downloading.'],
    clues: ['Metadata says the screenshot was captured on Kabir’s phone.', 'The crop hides the sender name but not the roll number watermark.', 'A senior denies sending any list.'],
    suspects: ['Kabir', 'Maya', 'Rohan', 'Ishika'],
    liar: 'Kabir',
    truth: 'Kabir captured and leaked the shortlist himself.',
    difficulty: 4,
    timer: 55,
    twist: 'The sender story is emotional cover. Check file metadata.'
  },
  {
    id: 22,
    title: 'Case 22: The Lab Result Swap',
    setting: 'Two lab result sheets were swapped before evaluation.',
    chat: ['Ishika: My sheet must have been swapped by mistake.', 'Aarav: Your handwriting appears on both name boxes.', 'Ishika: I helped label everyone’s sheets.'],
    clues: ['Only Ishika’s marks improved after the swap.', 'Pen pressure on both name boxes matches Ishika’s pen.', 'Aarav’s original sheet has erased initials under Ishika’s name.'],
    suspects: ['Ishika', 'Aarav', 'Neha', 'Kavin'],
    liar: 'Ishika',
    truth: 'Ishika swapped the sheets intentionally.',
    difficulty: 4,
    timer: 54,
    twist: 'Helping label sheets gave her opportunity, not innocence.'
  },
  {
    id: 23,
    title: 'Case 23: The Charity QR Code',
    setting: 'Donation money went to the wrong account.',
    chat: ['Rohan: I pasted the QR sent by the club.', 'Sana: The QR account name is yours.', 'Rohan: It was a temporary collection account.'],
    clues: ['Club account name is different.', 'Rohan’s QR was printed before the club approved collection.', 'Two donors got thank-you messages from Rohan personally.'],
    suspects: ['Rohan', 'Sana', 'Priya', 'Dev'],
    liar: 'Rohan',
    truth: 'Rohan replaced the charity QR with his own.',
    difficulty: 4,
    timer: 53,
    twist: 'Temporary account is the excuse. Approval timing exposes him.'
  },
  {
    id: 24,
    title: 'Case 24: The Locked Folder',
    setting: 'A private folder was accessed during a break.',
    chat: ['Anika: I do not know your laptop password.', 'Meera: You guessed it once last semester.', 'Anika: I forgot it immediately.'],
    clues: ['Laptop unlocked at 11:06 with correct password, not fingerprint.', 'Anika’s USB drive was inserted at 11:08.', 'Meera was presenting on stage from 11:00 to 11:15.'],
    suspects: ['Anika', 'Meera', 'Vikram', 'Arjun'],
    liar: 'Anika',
    truth: 'Anika accessed the folder using the old password.',
    difficulty: 4,
    timer: 52,
    twist: 'The password memory matters more than the USB clue alone.'
  },
  {
    id: 25,
    title: 'Case 25: The Sports Trial Entry',
    setting: 'Someone added their name after registration closed.',
    chat: ['Arjun: Coach added me manually.', 'Nila: The sheet edit was from your account.', 'Arjun: Coach used my laptop.'],
    clues: ['Coach was on the field with no laptop at edit time.', 'Edit history shows Arjun added only his own name.', 'The account session came from Arjun’s hostel Wi-Fi.'],
    suspects: ['Arjun', 'Nila', 'Coach', 'Maya'],
    liar: 'Arjun',
    truth: 'Arjun added his own name after the deadline.',
    difficulty: 4,
    timer: 51,
    twist: 'Manual addition is possible, but the account location breaks the story.'
  },
  {
    id: 26,
    title: 'Case 26: The Missing Prototype',
    setting: 'A hackathon prototype vanished before demo.',
    chat: ['Kavin: I packed only my charger.', 'Priya: Your bag looked bulky after lunch.', 'Kavin: I had my jacket inside.'],
    clues: ['Prototype tracker pinged near Kavin’s hostel room.', 'Kavin’s jacket was seen on his chair, not in the bag.', 'His charger bag weight increased by 900 grams.'],
    suspects: ['Kavin', 'Priya', 'Dev', 'Sana'],
    liar: 'Kavin',
    truth: 'Kavin hid the prototype in his bag.',
    difficulty: 4,
    timer: 50,
    twist: 'The jacket is the false cover. Weight and tracker agree.'
  },
  {
    id: 27,
    title: 'Case 27: The Double Screenshot',
    setting: 'Two screenshots prove different stories.',
    chat: ['Priya: I warned everyone at 5:30.', 'Vikram: Your screenshot was taken after my complaint.', 'Priya: I saved it later, but sent it earlier.'],
    clues: ['Group export shows no Priya message at 5:30.', 'Priya’s screenshot has a reply to a message sent at 6:02.', 'Her phone clock in screenshot shows 6:11.'],
    suspects: ['Priya', 'Vikram', 'Meera', 'Aarav', 'Neha'],
    liar: 'Priya',
    truth: 'Priya created the warning screenshot after the complaint.',
    difficulty: 5,
    timer: 45,
    twist: 'Ignore the claimed send time. The reply order reveals the lie.'
  },
  {
    id: 28,
    title: 'Case 28: The Hostel Gate Pass',
    setting: 'A gate pass was used while the owner was asleep.',
    chat: ['Maya: I never gave my pass to anyone.', 'Nila: Your pass scanned at 10:18 PM.', 'Maya: Gate scanner sometimes repeats old scans.'],
    clues: ['Scanner logs show live face mismatch alert.', 'Maya’s roommate says Maya slept from 9:50.', 'Nila’s bag contained Maya’s pass card at 10:40.'],
    suspects: ['Maya', 'Nila', 'Roommate', 'Rohan', 'Anika'],
    liar: 'Nila',
    truth: 'Nila used Maya’s gate pass while Maya was asleep.',
    difficulty: 5,
    timer: 44,
    twist: 'Maya sounds defensive, but the physical card points to Nila.'
  },
  {
    id: 29,
    title: 'Case 29: The Prize Claim',
    setting: 'A competition prize was claimed by the wrong teammate.',
    chat: ['Dev: I wrote the final algorithm alone.', 'Kabir: The commit history shows my code.', 'Dev: I cleaned and reuploaded everything.'],
    clues: ['Original commit author is Kabir.', 'Dev’s upload happened after results were announced.', 'The algorithm comments include Kabir’s initials and old variable names.'],
    suspects: ['Dev', 'Kabir', 'Ishika', 'Sana', 'Arjun'],
    liar: 'Dev',
    truth: 'Dev claimed Kabir’s algorithm as his own.',
    difficulty: 5,
    timer: 43,
    twist: 'Reuploading cleaned code does not erase authorship evidence.'
  },
  {
    id: 30,
    title: 'Case 30: Final Case — The Perfect Alibi',
    setting: 'A final layered case with a fake alibi and planted clue.',
    chat: ['Meera: I was in the seminar hall when the file was deleted.', 'Arjun: The deletion happened from your laptop.', 'Meera: Someone else used it while I was away.', 'Sana: I saw Meera carrying the laptop after the seminar started.'],
    clues: ['Seminar attendance QR was scanned by Meera at 10:01.', 'File deletion happened at 10:04 from Meera’s laptop.', 'CCTV shows Meera leaving the hall at 10:02 and returning at 10:07.', 'Sana’s statement matches the CCTV timing.', 'The planted clue points to Arjun, but his device was offline.'],
    suspects: ['Meera', 'Arjun', 'Sana', 'Dev', 'Priya'],
    liar: 'Meera',
    truth: 'Meera scanned attendance, left briefly, deleted the file, and returned.',
    difficulty: 5,
    timer: 42,
    twist: 'The alibi is partially true. She attended, but left during the critical window.'
  }
];

function getSaved() {
  try {
    return JSON.parse(localStorage.getItem('lieMeterProgress')) || { unlocked: 1, xp: 0, streak: 0, solved: {} };
  } catch {
    return { unlocked: 1, xp: 0, streak: 0, solved: {} };
  }
}

function App() {
  const [progress, setProgress] = useState(getSaved);
  const [caseId, setCaseId] = useState(progress.unlocked || 1);
  const [screen, setScreen] = useState('home');
  const [selected, setSelected] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [hints, setHints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const currentCase = allCases.find(c => c.id === caseId) || allCases[0];

  useEffect(() => {
    localStorage.setItem('lieMeterProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (screen !== 'case' || !currentCase.timer || revealed) return;
    setTimeLeft(currentCase.timer);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, caseId, revealed]);

  const rank = useMemo(() => ranks[Math.min(ranks.length - 1, Math.floor(progress.xp / 180))], [progress.xp]);
  const correct = selected === currentCase.liar;
  const confidence = Math.min(98, 55 + currentCase.difficulty * 8 + (correct ? 15 : -18) - hints * 6);

  function startCase(id) {
    setCaseId(id);
    setSelected('');
    setRevealed(false);
    setHints(0);
    setScreen('case');
  }

  function submit() {
    if (!selected) return;
    const timeBonus = timeLeft ? Math.max(0, Math.floor(timeLeft / 4)) : 0;
    const score = correct ? 50 + currentCase.difficulty * 20 + timeBonus - hints * 10 : 0;
    const nextUnlocked = correct ? Math.max(progress.unlocked, currentCase.id + 1) : progress.unlocked;
    setProgress(p => ({
      unlocked: Math.min(30, nextUnlocked),
      xp: p.xp + score,
      streak: correct ? p.streak + 1 : 0,
      solved: { ...p.solved, [currentCase.id]: correct ? 'perfect' : 'failed' }
    }));
    setRevealed(true);
  }

  function resetProgress() {
    const fresh = { unlocked: 1, xp: 0, streak: 0, solved: {} };
    setProgress(fresh);
    setCaseId(1);
    setScreen('home');
  }

  if (screen === 'levels') {
    return <div className="app shell">
      <Header progress={progress} rank={rank} />
      <section className="panel">
        <div className="section-title"><Trophy size={20}/> Case Board</div>
        <div className="levels">
          {allCases.map(c => {
            const locked = c.id > progress.unlocked;
            return <button key={c.id} className={`level-card ${locked ? 'locked' : ''}`} onClick={() => !locked && startCase(c.id)}>
              <span>{locked ? <Lock size={18}/> : `#${c.id}`}</span>
              <b>{c.title.replace(`Case ${c.id}: `, '')}</b>
              <small>Difficulty {c.difficulty}/5 {c.timer ? `• ${c.timer}s` : ''}</small>
            </button>
          })}
        </div>
        <button className="secondary" onClick={() => setScreen('home')}>Back Home</button>
      </section>
    </div>
  }

  if (screen === 'case') {
    return <div className="app shell">
      <Header progress={progress} rank={rank} />
      <section className="case-top">
        <div>
          <p className="eyebrow">Difficulty {currentCase.difficulty}/5</p>
          <h1>{currentCase.title}</h1>
          <p>{currentCase.setting}</p>
        </div>
        {currentCase.timer && <div className="timer"><Clock3 size={18}/> {timeLeft ?? currentCase.timer}s</div>}
      </section>

      <section className="panel">
        <div className="section-title"><MessageSquare size={20}/> Evidence Chat</div>
        {currentCase.chat.map((line, idx) => <div className="chat" key={idx}>{line}</div>)}
      </section>

      <section className="panel">
        <div className="section-title"><Search size={20}/> Clue Board</div>
        {currentCase.clues.slice(0, 2 + hints).map((clue, idx) => <div className="clue" key={idx}><Eye size={16}/> {clue}</div>)}
        {currentCase.twist && <div className="twist"><ShieldAlert size={16}/> {currentCase.twist}</div>}
        {!revealed && hints < Math.min(currentCase.clues.length - 2, 3) && <button className="hint" onClick={() => setHints(h => h + 1)}><Lightbulb size={16}/> Reveal hint -10 score</button>}
      </section>

      <section className="panel">
        <div className="section-title"><Brain size={20}/> Who is lying?</div>
        <div className="suspects">
          {currentCase.suspects.map(s => <button key={s} className={selected === s ? 'suspect active' : 'suspect'} onClick={() => !revealed && setSelected(s)}>{s}</button>)}
        </div>
        {!revealed ? <button className="primary" disabled={!selected || timeLeft === 0} onClick={submit}>{timeLeft === 0 ? 'Time Over' : 'Lock Answer'}</button> : <Result correct={correct} currentCase={currentCase} confidence={confidence} onNext={() => startCase(Math.min(30, currentCase.id + 1))} onLevels={() => setScreen('levels')} />}
      </section>
    </div>
  }

  return <div className="app shell home">
    <div className="hero">
      <div className="badge"><Zap size={16}/> Mobile Mystery Game</div>
      <h1>Lie Meter:<br/>Truth Detective</h1>
      <p>Read chats, inspect clues, catch contradictions, and expose the liar before the case gets cold.</p>
      <button className="primary" onClick={() => startCase(progress.unlocked)}>Continue Case {progress.unlocked}</button>
      <button className="secondary" onClick={() => setScreen('levels')}>Open Case Board</button>
    </div>

    <section className="stats-grid">
      <div><b>{progress.xp}</b><span>XP</span></div>
      <div><b>{progress.streak}</b><span>Streak</span></div>
      <div><b>{rank}</b><span>Rank</span></div>
    </section>

    <section className="panel">
      <div className="section-title"><Brain size={20}/> Difficulty System</div>
      <p className="body-text">Early levels have obvious lies. Later levels add more suspects, fake evidence, emotional manipulation, hidden contradictions, timers, and fewer safe hints.</p>
      <button className="danger" onClick={resetProgress}><RotateCcw size={16}/> Reset Progress</button>
    </section>
  </div>
}

function Header({ progress, rank }) {
  return <header className="header">
    <div><b>Lie Meter</b><span>{rank}</span></div>
    <div className="pill">XP {progress.xp}</div>
  </header>
}

function Result({ correct, currentCase, confidence, onNext, onLevels }) {
  return <div className={`result ${correct ? 'win' : 'lose'}`}>
    <h2>{correct ? 'Truth Exposed!' : 'Wrong Read'}</h2>
    <div className="meter"><span style={{ width: `${Math.max(10, confidence)}%` }}></span></div>
    <p>Lie confidence: <b>{Math.max(10, confidence)}%</b></p>
    <p><b>Answer:</b> {currentCase.liar}</p>
    <p>{currentCase.truth}</p>
    <div className="actions">
      <button className="primary" onClick={onNext}>Next Case</button>
      <button className="secondary" onClick={onLevels}>Levels</button>
    </div>
  </div>
}

createRoot(document.getElementById('root')).render(<App />);
