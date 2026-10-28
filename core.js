/* ETHICAL HELPER — Decision Compass. Original creator: Cornelius Aurelius.
 * Transparent, deterministic reflection logic; not a language model. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.EthicalHelperCore=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const VALUES={fairness:'Fairness',honesty:'Honesty',care:'Care',privacy:'Privacy',autonomy:'Autonomy',responsibility:'Responsibility',safety:'Safety',trust:'Trust'};
  const EMPTY_OPTION=()=>({name:'',benefit:'',concern:'',consent:'unknown',reversible:'unknown'});
  const clean=(value,max=1200)=>String(value??'').trim().slice(0,max);
  const initial=()=>({situation:'',affected:'',stakes:'moderate',values:['fairness','care'],options:[EMPTY_OPTION(),EMPTY_OPTION()],nextStep:''});
  function sanitise(data){
    const d=data&&typeof data==='object'?data:{};
    const values=Array.isArray(d.values)?d.values.filter(x=>Object.prototype.hasOwnProperty.call(VALUES,x)).slice(0,4):[];
    const supplied=Array.isArray(d.options)?d.options:[];
    return {situation:clean(d.situation,1600),affected:clean(d.affected,500),stakes:['everyday','moderate','serious'].includes(d.stakes)?d.stakes:'moderate',values:[...new Set(values)],options:[0,1].map(i=>({name:clean(supplied[i]?.name,130),benefit:clean(supplied[i]?.benefit,450),concern:clean(supplied[i]?.concern,450),consent:['yes','no','unknown'].includes(supplied[i]?.consent)?supplied[i].consent:'unknown',reversible:['yes','no','unknown'].includes(supplied[i]?.reversible)?supplied[i].reversible:'unknown'})),nextStep:clean(d.nextStep,380)};
  }
  function validateStep(d,step){
    const s=sanitise(d);
    if(step===0 && s.situation.length<12)return 'Describe the decision in at least a short sentence.';
    if(step===1 && !s.values.length)return 'Choose at least one value that matters in this decision.';
    if(step===2){
      if(s.options.some(o=>o.name.length<3))return 'Give each option a short name.';
      if(s.options[0].name.toLowerCase()===s.options[1].name.toLowerCase())return 'Give your two options different names.';
    }
    return '';
  }
  function summarise(d){
    const s=sanitise(d);
    const choices=s.options.map((option,index)=>{
      const cautions=[];
      const questions=[];
      if(option.consent==='no'){cautions.push('The people affected may not have agreed to this.');questions.push('How could you seek meaningful consent, or avoid imposing this choice?');}
      if(option.consent==='unknown')questions.push('Whose consent or input still needs checking?');
      if(option.reversible==='no'){cautions.push('It may be difficult to undo.');questions.push('Could you try a smaller, reversible step first?');}
      if(option.reversible==='unknown')questions.push('What would it take to reverse this decision?');
      if(!option.benefit)questions.push('What positive outcome is realistically expected?');
      if(!option.concern)questions.push('What might go wrong for someone affected?');
      if(s.stakes==='serious')questions.push('What qualified advice or independent review would reduce the risk?');
      if(s.values.includes('privacy'))questions.push('Could personal data or confidentiality be affected?');
      if(s.values.includes('fairness'))questions.push('Who gains, and who might bear an unfair share of the cost?');
      if(s.values.includes('honesty'))questions.push('Could you explain this decision openly without misleading anyone?');
      if(s.values.includes('care'))questions.push('Who may need extra support or consideration?');
      if(s.values.includes('autonomy'))questions.push('Can the people affected make an informed choice?');
      if(s.values.includes('safety'))questions.push('What safeguard would prevent foreseeable harm?');
      if(s.values.includes('trust'))questions.push('How could this affect trust over time?');
      if(s.values.includes('responsibility'))questions.push('Who will own the consequences and follow through?');
      return {index,label:option.name||'Option '+(index+1),benefit:option.benefit||'Not yet described',concern:option.concern||'Not yet described',consent:option.consent,reversible:option.reversible,cautions,questions:[...new Set(questions)].slice(0,5)};
    });
    const contextQuestions=['What facts are you assuming rather than confirming?'];
    if(!s.affected)contextQuestions.push('List the people who may be affected, including those not present.');
    if(s.stakes==='serious')contextQuestions.push('Pause before acting; consider qualified or independent support.');
    return {situation:s.situation||'Not described',affected:s.affected||'Not listed yet',stakes:s.stakes,values:s.values.map(v=>VALUES[v]),choices,contextQuestions,nextStep:s.nextStep||'Confirm a missing fact or ask someone affected for their perspective.'};
  }
  const EXAMPLES=[
    {name:'Workplace fairness',situation:'A teammate has taken credit for shared work. Should I raise it privately or bring it to my manager?',affected:'Me, my teammate, the team and our manager',stakes:'moderate',values:['fairness','honesty','care'],options:[{name:'Talk privately first',benefit:'Creates an opportunity to correct the record constructively.',concern:'The discussion could feel uncomfortable.',consent:'yes',reversible:'yes'},{name:'Raise it with the manager',benefit:'Creates a formal record and invites oversight.',concern:'May damage trust before hearing the teammate’s perspective.',consent:'unknown',reversible:'unknown'}]},
    {name:'Technology & privacy',situation:'Our volunteer group wants to publish photos of an event. Should we post them now or ask everyone pictured first?',affected:'Volunteers, attendees and anyone identifiable in the photos',stakes:'moderate',values:['privacy','autonomy','trust'],options:[{name:'Publish immediately',benefit:'Share the event quickly.',concern:'People may be identifiable without permission.',consent:'unknown',reversible:'no'},{name:'Check consent first',benefit:'Respects people’s preferences and reduces privacy risks.',concern:'Takes more time.',consent:'yes',reversible:'yes'}]},
    {name:'Friendship & honesty',situation:'A friend asked for my opinion about a decision they feel excited about. Should I speak candidly or avoid upsetting them?',affected:'My friend and me',stakes:'everyday',values:['honesty','care','trust'],options:[{name:'Offer kind, honest feedback',benefit:'Helps them decide with more information.',concern:'They might initially feel hurt.',consent:'yes',reversible:'yes'},{name:'Say only what they want to hear',benefit:'May avoid an awkward moment.',concern:'Could undermine trust later.',consent:'unknown',reversible:'unknown'}]}
  ];
  return Object.freeze({VALUES,initial,sanitise,validateStep,summarise,EXAMPLES});
});