function changeSlider(inp, sliderId, isPer = false, isNoSym = false, isResCl = false) {
  let val = inp.value
    .replace("$", "")
    .replace("%", "")
    .replace(/,/g, "")
    .replace(/(?<=\..*)\./g, "");
  if (!isPer && !isNoSym) {
    inp.value = "$" + numberWithCommas(val);
  } else if (isPer) {
    inp.value = numberWithCommas(val) + "%";
  } else if (isNoSym) {
    inp.value = numberWithCommas(val);
  }
  let ele = document.getElementById(sliderId);
  if (isNaN(val) || !val) {
    val = 0;
  }
  ele.value = val;
  ele.style.background = `linear-gradient(to right, #2c325a 0%, #2c325a ${
    ((val - ele.min) / (ele.max - ele.min)) * 100
  }%, #DEE2E6 ${((val - ele.min) / (ele.max - ele.min)) * 100}%, #DEE2E6 100%)`;
  if (isResCl) {
    generateGrowthPlan(true);
  } else {
    generateGrowthPlan();
  }
}

function calculate(ele, isPer = false, isDol = true, isResCl = false) {
  let slectPrice = ele.parentNode.parentNode.children[0].children[1];
  ele.style.background = `linear-gradient(to right, #2c325a 0%, #2c325a ${
    ((ele.value - ele.min) / (ele.max - ele.min)) * 100
  }%, #DEE2E6 ${((ele.value - ele.min) / (ele.max - ele.min)) * 100}%, #DEE2E6 100%)`;
  if (isPer) {
    slectPrice.value = formatter.format(ele.value).replace("$", "") + "%";
  } else if (isDol) {
    slectPrice.value = formatter.format(ele.value);
  } else {
    slectPrice.value = formatter.format(ele.value).replace("$", "");
  }
  if (isResCl) {
    generateGrowthPlan(true);
  } else {
    generateGrowthPlan();
  }
}
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
function numberWithCommas(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".").replace(/(?<=\..*)\./g, "");
}
function generateGrowthPlan(newClientRes = false) {
  let annualClientValue = document.getElementById("annualClientValue").value * 1;
  let lifeTimeGrossSales = document.getElementById("lifeTimeGrossSales").value * 1;
  let appointmentToSale = (document.getElementById("appointmentToSale").value * 1) / 100;
  let currentBizDevTeamSize = document.getElementById("currentBizDevTeamSize").value * 1;
  let newClientAnnualTarget = document.getElementById("newClientAnnualTarget").value * 1;
  if (newClientRes) {
    newClientAnnualTarget = document.getElementById("newClientAnnualTargetRes").value * 1;
  } else {
    let ele = document.getElementById("newClientAnnualTargetRes");
    ele.value = newClientAnnualTarget;
    document.getElementById("resMaxCalc").value = ele.value;
    ele.style.background = `linear-gradient(to right, #2c325a 0%, #2c325a ${
      ((ele.value - ele.min) / (ele.max - ele.min)) * 100
    }%, #DEE2E6 ${((ele.value - ele.min) / (ele.max - ele.min)) * 100}%, #DEE2E6 100%)`;
  }
  calculateValues(
    annualClientValue,
    appointmentToSale,
    newClientAnnualTarget,
    currentBizDevTeamSize,
    lifeTimeGrossSales
  );
}
function calculateValues(
  annualClientValue,
  appointmentToSale,
  newClientAnnualTarget,
  currentBizDevTeamSize,
  lifeTimeGrossSales
) {
  let appointmentPerYearRes = newClientAnnualTarget / appointmentToSale;
  let appointmentPerMonthRes = appointmentPerYearRes / 12;
  let qualificationLeadPerYearRes = appointmentPerYearRes / 0.25;
  let qualificationLeadPerMonthRes = qualificationLeadPerYearRes / 12;
  let leadsPerYearRes = qualificationLeadPerYearRes / 0.15;
  let leadsPerMonthRes = leadsPerYearRes / 12;
  let outreachPerYearRes = leadsPerYearRes / 0.02;
  let outreachPerMonthRes = outreachPerYearRes / 12;
  let newAnnualYearPerYearRes = annualClientValue * newClientAnnualTarget;
  let newAnnualYearPerMonthRes = newAnnualYearPerYearRes / 12;
  let pipeLinePerYearRes = qualificationLeadPerYearRes * annualClientValue;
  let pipeLinePerMonthRes = pipeLinePerYearRes / 12;
  let estimatePricePerAppointmentRes = annualClientValue / 150;
  let roiAppointment =
    newAnnualYearPerYearRes - (appointmentPerYearRes * estimatePricePerAppointmentRes + 17964);
  let roiLead = newAnnualYearPerYearRes - currentBizDevTeamSize * 499 * 12;
  let roiXAppointment =
    roiAppointment / (appointmentPerYearRes * estimatePricePerAppointmentRes + 17964);
  let roiXLead = roiLead / (currentBizDevTeamSize * 499 * 12);
  document.getElementById("message").value = generateEmailTemplate(
    newClientAnnualTarget,
    appointmentPerYearRes,
    appointmentPerMonthRes,
    qualificationLeadPerYearRes,
    qualificationLeadPerMonthRes,
    leadsPerYearRes,
    leadsPerMonthRes,
    outreachPerYearRes,
    outreachPerMonthRes,
    newAnnualYearPerYearRes,
    newAnnualYearPerMonthRes,
    pipeLinePerYearRes,
    pipeLinePerMonthRes,
    estimatePricePerAppointmentRes,
    roiXAppointment,
    roiXLead,
    roiAppointment,
    roiLead
  );
  updateUI(
    annualClientValue,
    lifeTimeGrossSales,
    newClientAnnualTarget,
    appointmentPerYearRes,
    appointmentPerMonthRes,
    qualificationLeadPerYearRes,
    qualificationLeadPerMonthRes,
    leadsPerYearRes,
    leadsPerMonthRes,
    outreachPerYearRes,
    outreachPerMonthRes,
    newAnnualYearPerYearRes,
    newAnnualYearPerMonthRes,
    pipeLinePerYearRes,
    pipeLinePerMonthRes,
    estimatePricePerAppointmentRes,
    roiXAppointment,
    roiXLead,
    roiAppointment,
    roiLead
  );
}
function updateUI(
  annualClientValue,
  lifeTimeGrossSales,
  newClientAnnualTarget,
  appointmentPerYearRes,
  appointmentPerMonthRes,
  qualificationLeadPerYearRes,
  qualificationLeadPerMonthRes,
  leadsPerYearRes,
  leadsPerMonthRes,
  outreachPerYearRes,
  outreachPerMonthRes,
  newAnnualYearPerYearRes,
  newAnnualYearPerMonthRes,
  pipeLinePerYearRes,
  pipeLinePerMonthRes,
  estimatePricePerAppointmentRes,
  roiXAppointment,
  roiXLead,
  roiAppointment,
  roiLead
) {
  let currentBizDevTeamSize = document.getElementById("currentBizDevTeamSize").value * 1;
  let growthPlanContainer = document.getElementById("growthPlanContainer");
  let inputContainer = document.getElementById("inputContainer");
  let companyName = document.querySelectorAll("#companyName");
  let appointmentPerYear = document.getElementById("appointmentPerYear");
  let appointmentPerMonth = document.getElementById("appointmentPerMonth");
  let qualificationLeadPerYear = document.getElementById("qualificationLeadPerYear");
  let qualificationLeadPerYear1 = document.getElementById("qualificationLeadPerYear1");
  let qualificationLeadPerMonth = document.getElementById("qualificationLeadPerMonth");
  let qualificationLeadPerMonth1 = document.getElementById("qualificationLeadPerMonth1");
  let leadsPerYear = document.getElementById("leadsPerYear");
  let leadsPerMonth = document.getElementById("leadsPerMonth");
  let contentViewPerYear = document.getElementById("contentViewPerYear");
  let contentViewPerMonth = document.getElementById("contentViewPerMonth");
  let positiveRepliesPerYear = document.getElementById("positiveRepliesPerYear");
  let positiveRepliesPerMonth = document.getElementById("positiveRepliesPerMonth");
  let outreachPerYear = document.getElementById("outreachPerYear");
  let outreachPerMonth = document.getElementById("outreachPerMonth");
  let newAnnualYearPerYear = document.getElementById("newAnnualYearPerYear");
  let newAnnualYearPerYear1 = document.getElementById("newAnnualYearPerYear1");
  let newAnnualYearPerMonth = document.getElementById("newAnnualYearPerMonth");
  let newAnnualYearPerMonth1 = document.getElementById("newAnnualYearPerMonth1");
  let pipeLinePerYear = document.getElementById("pipeLinePerYear");
  let pipeLinePerMonth = document.getElementById("pipeLinePerMonth");
  let roiLeadEle = document.getElementById("roiLeadEle");
  let roiXLeadEle = document.getElementById("roiXLeadEle");
  let roiAppointmentEle = document.getElementById("roiAppointmentEle");
  let roiXAppointmentEle = document.getElementById("roiXAppointmentEle");
  let estimatePricePerAppointment = document.getElementById("estimatePricePerAppointment");
  let clientTarget = document.getElementById("clientTarget");
  let companynameForm = document.getElementById("companynameForm").value;
  let estimatedSubsriptionFeeLeadYearly = document.getElementById(
    "estimatedSubsriptionFeeLeadYearly"
  );
  let estimatedSubsriptionFeeLeadMonthly = document.getElementById(
    "estimatedSubsriptionFeeLeadMonthly"
  );
  let estimatedSubsriptionFeeAppointmentYearly = document.getElementById(
    "estimatedSubsriptionFeeAppointmentYearly"
  );
  let estimatedSubsriptionFeeAppointmentMonthly = document.getElementById(
    "estimatedSubsriptionFeeAppointmentMonthly"
  );
  let newAppointmentYearlyEle = document.getElementById("newAppointmentYearlyEle");
  let newAppointmentMonthlyEle = document.getElementById("newAppointmentMonthlyEle");
  isNaN(appointmentPerYearRes)
    ? (appointmentPerYearRes = 0)
    : (appointmentPerYearRes = appointmentPerYearRes);
  isNaN(appointmentPerMonthRes)
    ? (appointmentPerMonthRes = 0)
    : (appointmentPerMonthRes = appointmentPerMonthRes);
  isNaN(qualificationLeadPerYearRes)
    ? (qualificationLeadPerYearRes = 0)
    : (qualificationLeadPerYearRes = qualificationLeadPerYearRes);
  isNaN(qualificationLeadPerMonthRes)
    ? (qualificationLeadPerMonthRes = 0)
    : (qualificationLeadPerMonthRes = qualificationLeadPerMonthRes);
  isNaN(leadsPerYearRes) ? (leadsPerYearRes = 0) : (leadsPerYearRes = leadsPerYearRes);
  isNaN(leadsPerMonthRes) ? (leadsPerMonthRes = 0) : (leadsPerMonthRes = leadsPerMonthRes);
  isNaN(outreachPerYearRes) ? (outreachPerYearRes = 0) : (outreachPerYearRes = outreachPerYearRes);
  isNaN(outreachPerMonthRes)
    ? (outreachPerMonthRes = 0)
    : (outreachPerMonthRes = outreachPerMonthRes);
  isNaN(newAnnualYearPerYearRes)
    ? (newAnnualYearPerYearRes = 0)
    : (newAnnualYearPerYearRes = newAnnualYearPerYearRes);
  isNaN(newAnnualYearPerMonthRes)
    ? (newAnnualYearPerMonthRes = 0)
    : (newAnnualYearPerMonthRes = newAnnualYearPerMonthRes);
  isNaN(pipeLinePerYearRes) ? (pipeLinePerYearRes = 0) : (pipeLinePerYearRes = pipeLinePerYearRes);
  isNaN(pipeLinePerMonthRes)
    ? (pipeLinePerMonthRes = 0)
    : (pipeLinePerMonthRes = pipeLinePerMonthRes);
  isNaN(estimatePricePerAppointmentRes)
    ? (estimatePricePerAppointmentRes = 0)
    : (estimatePricePerAppointmentRes = estimatePricePerAppointmentRes);
  isNaN(roiXAppointment) ? (roiXAppointment = 0) : (roiXAppointment = roiXAppointment);
  isNaN(roiXLead) ? (roiXLead = 0) : (roiXLead = roiXLead);
  isNaN(roiAppointment) ? (roiAppointment = 0) : (roiAppointment = roiAppointment);
  isNaN(roiLead) ? (roiLead = 0) : (roiLead = roiLead);
  appointmentPerYear.innerHTML = formatter.format(appointmentPerYearRes).replace("$", "");
  appointmentPerMonth.innerHTML = formatter.format(appointmentPerMonthRes).replace("$", "");
  newAppointmentMonthlyEle.innerHTML = formatter.format(appointmentPerMonthRes).replace("$", "");
  newAppointmentYearlyEle.innerHTML = formatter.format(appointmentPerYearRes).replace("$", "");
  qualificationLeadPerYear.innerHTML = formatter
    .format(qualificationLeadPerYearRes)
    .replace("$", "");
  qualificationLeadPerYear1.innerHTML = formatter
    .format(qualificationLeadPerYearRes)
    .replace("$", "");
  qualificationLeadPerMonth.innerHTML = formatter
    .format(qualificationLeadPerMonthRes)
    .replace("$", "");
  qualificationLeadPerMonth1.innerHTML = formatter
    .format(qualificationLeadPerMonthRes)
    .replace("$", "");
  leadsPerYear.innerHTML = formatter.format(leadsPerYearRes).replace("$", "");
  leadsPerMonth.innerHTML = formatter.format(leadsPerMonthRes).replace("$", "");
  contentViewPerYear.innerHTML = formatter.format(outreachPerYearRes).replace("$", "");
  contentViewPerMonth.innerHTML = formatter.format(outreachPerMonthRes).replace("$", "");
  positiveRepliesPerYear.innerHTML = formatter.format(leadsPerYearRes).replace("$", "");
  positiveRepliesPerMonth.innerHTML = formatter.format(leadsPerMonthRes).replace("$", "");
  outreachPerYear.innerHTML = formatter.format(outreachPerYearRes).replace("$", "");
  outreachPerMonth.innerHTML = formatter.format(outreachPerMonthRes).replace("$", "");
  newAnnualYearPerYear.innerHTML = formatter.format(newAnnualYearPerYearRes);
  newAnnualYearPerYear1.innerHTML = formatter.format(newAnnualYearPerYearRes);
  newAnnualYearPerMonth.innerHTML = formatter.format(newAnnualYearPerMonthRes);
  newAnnualYearPerMonth1.innerHTML = formatter.format(newAnnualYearPerMonthRes);
  pipeLinePerYear.innerHTML = formatter.format(pipeLinePerYearRes);
  pipeLinePerMonth.innerHTML = formatter.format(pipeLinePerMonthRes);
  estimatePricePerAppointment.innerHTML = formatter.format(estimatePricePerAppointmentRes);
  roiLeadEle.innerHTML = formatter.format(roiLead);
  roiLeadMonthlyEle.innerHTML = formatter.format(roiLead / 12);
  roiXLeadEle.innerHTML = formatter.format(roiXLead).replace("$", "");
  roiXLeadMonthlyEle.innerHTML = formatter.format(roiXLead / 12).replace("$", "");
  roiAppointmentEle.innerHTML = formatter.format(roiAppointment);
  roiAppointmentMonthlyEle.innerHTML = formatter.format(roiAppointment / 12);
  roiXAppointmentEle.innerHTML = formatter.format(roiXAppointment).replace("$", "");
  roiXAppointmentMonthlyEle.innerHTML = formatter.format(roiXAppointment / 12).replace("$", "");
  estimatedSubsriptionFeeAppointmentYearly.innerHTML = formatter.format(
    appointmentPerYearRes * estimatePricePerAppointmentRes
  );
  estimatedSubsriptionFeeAppointmentMonthly.innerHTML = formatter.format(
    (appointmentPerYearRes * estimatePricePerAppointmentRes) / 12
  );
  estimatedSubsriptionFeeLeadYearly.innerHTML = formatter.format(currentBizDevTeamSize * 499 * 12);
  estimatedSubsriptionFeeLeadMonthly.innerHTML = formatter.format(currentBizDevTeamSize * 499);
  clientTarget.innerHTML = newClientAnnualTarget;
  companyName.forEach((el) => {
    el.innerHTML = companynameForm;
  });
  let dedicatedTeamMemebers = leadsPerYearRes / 3000;

  conditionContent(
    annualClientValue,
    lifeTimeGrossSales,
    outreachPerYearRes,
    leadsPerYearRes,
    dedicatedTeamMemebers
  );
}
function removePopUp() {
  let bglayer = document.getElementById("bglayer");
  let popupcontainer = document.getElementById("popupcontainer");
  bglayer.style.display = "none";
  popupcontainer.style.display = "none";
}
function showPopUp() {
  let bglayer = document.getElementById("bglayer");
  let popupcontainer = document.getElementById("popupcontainer");
  bglayer.style.display = "block";
  popupcontainer.style.display = "block";
}
function conditionContent(
  annualClientValue,
  lifeTimeGrossSales,
  outreachPerYearRes,
  leadsPerYearRes,
  dedicatedTeamMemebers
) {
  let heading0 = document.getElementById("heading0");
  let heading1 = document.getElementById("heading1");
  let heading2 = document.getElementById("heading2");
  let heading3 = document.getElementById("heading3");
  let para0 = document.getElementById("para0");
  let para1 = document.getElementById("para1");
  let para2 = document.getElementById("para2");
  let para3 = document.getElementById("para3");
  if (annualClientValue > 20000 || lifeTimeGrossSales > 500000) {
    heading0.innerHTML = `High Level Growth Strategy:`;
    heading1.innerHTML = `<i class="fas fa-search icon__calc"></i>Perform Targeted Lead Generation`;
    heading2.innerHTML = `<i class="fas fa-bullhorn icon__calc"></i>Nurture Your Network with Content`;
    heading3.innerHTML = `<i class="fas fa-check-circle icon__calc"></i>Set Appointments with Qualified Leads`;
    para0.innerHTML = `Traction means you’re ready to scale! Here's the 3 steps needed to achieve predictable growth:`;
    para1.innerHTML = `Personally reach out to ${formatter
      .format(outreachPerYearRes)
      .replace(
        "$",
        ""
      )} targeted, pre-qualified prospects on email and LinkedIn to generate interest in your solution. Split test audiences and angles to see what resonates most.`;
    para2.innerHTML = `Post a mix of 60% engaging, high value story-driven content that resonates and 40% case study content to build pipeline at least 3x per week on social and email. Double down on high performing audiences and angles from your lead generation efforts.`;
    para3.innerHTML = `Proactively qualify and set appointments with prospects to ensure they're a great fit worthy of time on your team calendar. To pre-qualify ${formatter
      .format(leadsPerYearRes)
      .replace("$", "")} leads, dedicate at least ${formatter
      .format(dedicatedTeamMemebers)
      .replace("$", "")} dedicated team members to appointment setting.`;
  } else if (annualClientValue < 20000 || lifeTimeGrossSales < 500000) {
    heading0.innerHTML = "High Level Growth Strategy:";
    heading1.innerHTML = `<i class="fas fa-poll icon__calc"></i> Step 1. Perform Market Research with Surveys & Polls`;
    heading2.innerHTML = `<i class="fas fa-bullhorn icon__calc"></i> Step 2. Host Market Research Calls (Individually or as a Group)`;
    heading3.innerHTML = `<i class="fas fa-check-circle icon__calc"></i> Step 3. Pre-Sell a Beta Solution`;
    para0.innerHTML = `Before you scale things up, it’s critical to validate your messaging and high-ticket solution. Here’s exactly how yo do that:`;
    para1.innerHTML = `There are 3 primary questions that help you understand what I call the ‘secret treasure’ of your market. These are my favorite questions for market research:<br><br> 1. What is your #1 challenge right now with ______ (problem) ?<br> 2. What frustrates you the most about this? <br> 3. What have you tried to do about this so far?<br><br> So how do you perform market research as quickly and effectively as possible?<br><br> The laziest approach is the most effective way, which is by asking the market to tell you, using polls and surveys. <br><br> Start right now by sending an email survey or posting a poll on social media. `;
    para2.innerHTML = `Contact those who completed your survey and ask them if they’d be up for an obligation-free 30 minute discovery call in exchange for your personalized, expert insights on their problem. <br><br> You can do this in a 1:1 setting or as a group.<br><br>This is the ultimate win win. You gain invaluable market insights while building a relationship with an awesome potential client.<br><br>Until you are organically generating >3 sales per month, aim to be on at least 5-10 of these market research discovery calls per week until your offer is landing. `;
    para3.innerHTML = `Pre-sales and beta testing are a massively underrated strategy to gain traction fast with a solution that hasn’t yet been validated by the market.<br><br>After you or your growth team have spoken with at least 25-50 prospects about their problems, you’re in a great position to launch a beta presale for your solution at a temporary discount in exchange for being an early adapter.<br><br>We recommend you provide a temporary 25-50% discount to the ‘beta’ version of your high-ticket product or service. Simply be transparent with your prospects by telling them your service is not 100% ready and because of that, you are providing a discount in exchange for their investment and insights into developing your solution.<br><br>Our founder Matt Kohn used this strategy in the past to generate over $36,000 in presales for a $3,000 group consulting program.<br><br>Watch the interview here: <a href='https://www.youtube.com/watch?v=5L-AfNtwxSo'>https://www.youtube.com/watch?v=5L-AfNtwxSo</a><br>Read the case study here: <a href="https://www.thinkific.com/blog/presell-productize-and-scale-coaching-business/">https://www.thinkific.com/blog/presell-productize-and-scale-coaching-business/</a>`;
  }
}
window.onload = function () {
  document.getElementById("genereatePlanForm").addEventListener("submit", function (event) {
    event.preventDefault();
    this.contact_number.value = (Math.random() * 100000) | 0;
    generateGrowthPlan();
    document.getElementById("generate").value = "Generating...";
    document.getElementById("generate").disabled = true;
    emailjs
      .sendForm("service_ugjnh0h", "template_n9gd3ll", this)
      .then((msg) => {
        downloadPDF();
        alert("Your message has been sent. Thanks");
        growthPlanContainer.style.display = "block";
        inputContainer.style.display = "none";
      })
      .catch((err) => {
        alert(`${err} There was an error while sending an email. Please try again`);
        console.log(err);
        // location.reload();
      });
  });
};
function generateEmailTemplate(
  newClientAnnualTarget,
  appointmentPerYearRes,
  appointmentPerMonthRes,
  qualificationLeadPerYearRes,
  qualificationLeadPerMonthRes,
  leadsPerYearRes,
  leadsPerMonthRes,
  outreachPerYearRes,
  outreachPerMonthRes,
  newAnnualYearPerYearRes,
  newAnnualYearPerMonthRes,
  pipeLinePerYearRes,
  pipeLinePerMonthRes,
  estimatePricePerAppointmentRes,
  roiXAppointment,
  roiXLead,
  roiAppointment,
  roiLead
) {
  let companynameForm = document.getElementById("companynameForm").value;
  let annualClientValue = document.getElementById("annualClientValue").value * 1;
  let lifeTimeGrossSales = document.getElementById("lifeTimeGrossSales").value * 1;
  let appointmentToSale = document.getElementById("appointmentToSale").value * 1;
  let currentBizDevTeamSize = document.getElementById("currentBizDevTeamSize").value * 1;
  let uname = document.getElementById("uname").value;
  let quality = document.getElementById("quality").checked;
  let speed = document.getElementById("speed").checked;
  let proprietaryProduct = document.getElementById("proprietaryProduct").checked;
  let costs = document.getElementById("costs").checked;
  let specialization = document.getElementById("specialization").checked;
  let html = `<html><body><div class="growthPlan__container" id="growthPlanContainer" style="padding: 10px"><span class="heading__main--calc" style="padding: 10px; font-size: 24px; font-weight: 700; margin: 15px 0px; display: block" ><span class="company__name" style="font-weight: 700"><span id="companyName">${companynameForm} </span></span >Predictable Growth Plan </span><div class="col2__calc" style=" display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; " >
  <!-- User Output calc -->

  <!-- Growth Target Table -->
  <div class="growthTargets__table--calc">
    <table
      style="
        border: 1px solid #ccc;
        border-collapse: collapse;
        margin: 0;
        padding: 0;
        width: 100%;
        table-layout: fixed;
      "
    >
      <thead>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
      
          <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
           Labels
          </th>
          <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
           Values
          </th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Annual Client Value

          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
            ${formatter.format(annualClientValue)}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Lifetime Gross Sales


          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
            ${formatter.format(lifeTimeGrossSales)}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Appointment to Sale %


          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
            ${formatter.format(appointmentToSale).replace("$", "") + "%"}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Current Biz Dev Team Size


          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
            ${formatter.format(currentBizDevTeamSize).replace("$", "")}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          New Client Annual Target


          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
            ${formatter.format(newClientAnnualTarget).replace("$", "")}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Quality
          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
          ${quality ? "Selected" : "Not-Selected"}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Speed
          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
          ${speed ? "Selected" : "Not-Selected"}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Proprietary Product

          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
          ${proprietaryProduct ? "Selected" : "Not-Selected"}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Costs
          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
          ${costs ? "Selected" : "Not-Selected"}
          </td>
        </tr>
        <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
          
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Label"
            id="appointmentPerYear"
          >
          Specialization
          </td>
          <td
            style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            data-label="Value"
            id="appointmentPerMonth"
          >
          ${specialization ? "Selected" : "Not-Selected"}
          </td>
        </tr>
       
      </tbody>
    </table>
  </div>
</div>
  
  <div class="col__calc width70" style="width: 100%; margin: 3px; margin-bottom: 7px"><div class="col2__calc" style="display: block"><div class="col__calc width65 backgroundlight__box" style=" width: 100%; margin: 3px; margin-bottom: 7px; padding: 10px; background-color: rgb(240, 240, 240); border-radius: 5px; " ><div class="useroutput__calc" style="padding: 5px"><span class="note__calc" style="display: block; padding: 7px; font-size: 18px" >In order to acquire <span class="client__target">${newClientAnnualTarget} </span>clients in the next 12 months for <span class="company__name" style="font-weight: 700"><span id="companyName">${companynameForm}</span></span >, here are your growth targets: </span></div><div class="growthTargets__table--calc"><table style=" border: 1px solid #ccc; border-collapse: collapse; margin: 0; padding: 0; width: 100%; table-layout: fixed; " ><thead><tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em"><th style=" padding: 0.625em; text-align: left; width: 100%; font-size: 0.85em; letter-spacing: 0.1em; text-transform: uppercase; " scope="col" >&nbsp; </th><th style="padding: 0.625em; text-align: left; width: 100%" scope="col">Per Year </th><th style="padding: 0.625em; text-align: left; width: 100%" scope="col">Per Month </th></tr></thead><tbody><tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em"><th style="padding: 0.625em; text-align: left; width: 100%" data-label="" >Appointments </th><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="appointmentPerYear" >${formatter
    .format(appointmentPerYearRes)
    .replace(
      "$",
      ""
    )} </td><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="appointmentPerMonth" >${formatter
    .format(appointmentPerMonthRes)
    .replace(
      "$",
      ""
    )} </td></tr><tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em"><th style="padding: 0.625em; text-align: left; width: 100%" data-label="">Qualification Leads </th><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="qualificationLeadPerYear" >${formatter
    .format(qualificationLeadPerYearRes)
    .replace(
      "$",
      ""
    )} </td><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="qualificationLeadPerMonth" >${formatter
    .format(qualificationLeadPerMonthRes)
    .replace(
      "$",
      ""
    )} </td></tr><tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em"><th style="padding: 0.625em; text-align: left; width: 100%" data-label="">Leads </th><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="leadsPerYear" >${formatter
    .format(leadsPerYearRes)
    .replace(
      "$",
      ""
    )} </td><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="leadsPerMonth" >${formatter
    .format(leadsPerMonthRes)
    .replace(
      "$",
      ""
    )} </td></tr><tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em"><th style="padding: 0.625em; text-align: left; width: 100%" data-label="">Content Views </th><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="contentViewPerYear" >${formatter
    .format(outreachPerYearRes)
    .replace(
      "$",
      ""
    )} </td><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="contentViewPerMonth" >${formatter
    .format(outreachPerMonthRes)
    .replace(
      "$",
      ""
    )} </td></tr><tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em"><th style="padding: 0.625em; text-align: left; width: 100%" data-label="">Positive Replies </th><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="positiveRepliesPerYear" >${formatter
    .format(leadsPerYearRes)
    .replace(
      "$",
      ""
    )} </td><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="positiveRepliesPerMonth" >${formatter
    .format(leadsPerMonthRes)
    .replace(
      "$",
      ""
    )} </td></tr><tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em"><th style="padding: 0.625em; text-align: left; width: 100%" data-label="">Outreach </th><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="outreachPerYear" >${formatter
    .format(outreachPerYearRes)
    .replace(
      "$",
      ""
    )} </td><td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="outreachPerMonth" >${formatter
    .format(outreachPerMonthRes)
    .replace(
      "$",
      ""
    )} </td></tr></tbody></table></div></div></div><span class="heading__main--calc" style=" padding: 10px; font-size: 24px; font-weight: 700; margin: 15px 0px; display: block; " >Prefer to trust the experts? Here's your projected ROI from managed services with Predictable Growth.</span > <div class="col2__calc" style="display: block">
    <!-- Output Labels -->
    <div
      class="col__calc width65 backgroundlight__box"
      style="
        width: 100%;
        margin: 3px;
        margin-bottom: 7px;
        padding: 10px;
        background-color: rgb(240, 240, 240);
        border-radius: 5px;
      "
    >
      <div class="roimanagedleads">
        <span
          class="heading__secondary"
          style="
            padding: 6px;
            font-size: 22px;
            margin: 10px 0px;
            display: block;
            font-weight: 700;
          "
          >Projected ROI from Managed Lead Generation</span
        >
        <table
          style="
            border: 1px solid #ccc;
            border-collapse: collapse;
            margin: 0;
            padding: 0;
            width: 100%;
            table-layout: fixed;
          "
        >
          <thead>
            <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
              <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
                &nbsp;
              </th>
              <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
                Per Year
              </th>
              <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
                Per Month
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
              <th style="padding: 0.625em; text-align: left; width: 100%" data-label=""><b>Estimated ROI($)</b></th>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"  data-label="Per Year" id="roiLeadEle">${formatter.format(
                roiLead
              )}</td>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="roiLeadMonthlyEle">${formatter.format(
                roiLead / 12
              )}</td>
            </tr>
            <tr  style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
              <th style="padding: 0.625em; text-align: left; width: 100%" data-label="" ><b>Estimated ROI(X) </b></th>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="roiXLeadEle">${formatter
                .format(roiXLead)
                .replace("$", "")}</td>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="roiXLeadMonthlyEle">${formatter
                .format(roiXLead / 12)
                .replace("$", "")}</td>
            </tr>
          

            <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
              <th  style="padding: 0.625em; text-align: left; width: 100%"data-label="">New Annual Revenue</th>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="newAnnualYearPerYear">${formatter.format(
                newAnnualYearPerYearRes
              )}</td>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="newAnnualYearPerMonth">${formatter.format(
                newAnnualYearPerMonthRes
              )}</td>
            </tr>
            <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
              <th style="padding: 0.625em; text-align: left; width: 100%" data-label="">New Qualified Leads</th>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="qualificationLeadPerYear1">${formatter.format(
                qualificationLeadPerYearRes
              )}</td>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="qualificationLeadPerMonth1">${formatter.format(
                qualificationLeadPerMonthRes
              )}</td>
            </tr>
            <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
              <th  style="padding: 0.625em; text-align: left; width: 100%"data-label="">New Business Pipeline</th>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="pipeLinePerYear">${formatter.format(
                pipeLinePerYearRes
              )}</td>
              <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="pipeLinePerMonth">${formatter.format(
                pipeLinePerMonthRes
              )}</td>
            </tr> 
            
              <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">

            
      


                <th style="padding: 0.625em; text-align: left; width: 100%" data-label="">Estimated Fee</th>
                <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="estimatedSubsriptionFeeLeadYearly">${formatter.format(
                  currentBizDevTeamSize * 499 * 12
                )}</td>
                <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="estimatedSubsriptionFeeLeadMonthly">${formatter.format(
                  currentBizDevTeamSize * 499
                )}</td>
              </tr>
          </tbody>
        </table>
      </div>
    </div><div class="col2__calc" style="display: block">
  <div
    class="col__calc width65 backgroundlight__box"
    style="
      width: 100%;
      margin: 3px;
      margin-bottom: 7px;
      padding: 10px;
      background-color: rgb(240, 240, 240);
      border-radius: 5px;
    "
  >
    <div class="roimanaged_settings">
      <span
        class="heading__secondary"
        style="
          padding: 6px;
          font-size: 22px;
          margin: 10px 0px;
          display: block;
          font-weight: 700;
        "
        >Projected ROI from Managed Appointment Seting</span
      >
      <table
        style="
          border: 1px solid #ccc;
          border-collapse: collapse;
          margin: 0;
          padding: 0;
          width: 100%;
          table-layout: fixed;
        "
      >
        <thead>
          <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
            <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
              &nbsp;
            </th>
            <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
              Per Year
            </th>
            <th style="padding: 0.625em; text-align: left; width: 100%" scope="col">
              Per Month
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
            <th style="padding: 0.625em; text-align: left; width: 100%" data-label="" ><b>Estimated ROI($)</b></th>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="roiAppointmentEle">${formatter.format(
              roiAppointment
            )}</td>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="roiAppointmentMonthlyEle">${formatter.format(
              roiAppointment / 12
            )}</td>
          </tr>
          <tr  style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
            <th style="padding: 0.625em; text-align: left; width: 100%" data-label=""><b>Estimated ROI(X)</b></th>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="roiXAppointmentEle">${formatter
              .format(roiXAppointment)
              .replace("$", "")}</td>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="roiXAppointmentMonthlyEle">${formatter
              .format(roiXAppointment / 12)
              .replace("$", "")}</td>
          </tr>
         <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em">
            <th style="padding: 0.625em; text-align: left; width: 100%" data-label="">New Annual Revenue</th>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="newAnnualYearPerYear1">${formatter.format(
              newAnnualYearPerYearRes
            )}</td>
            <td  style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"data-label="Per Month" id="newAnnualYearPerMonth1">${formatter.format(
              newAnnualYearPerMonthRes
            )}</td>
          </tr>
          <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em" >
            <th style="padding: 0.625em; text-align: left; width: 100%" data-label=""><b>New Appointments</b></th>
            <td  style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"data-label="Per Year" id="newAppointmentYearlyEle">${formatter
              .format(appointmentPerYearRes)
              .replace("$", "")}</td>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="newAppointmentMonthlyEle">${formatter
              .format(appointmentPerMonthRes)
              .replace("$", "")}</td>
          </tr>
            <tr style="background-color: #f8f8f8; border: 1px solid #ddd; padding: 0.35em" >
            <th style="padding: 0.625em; text-align: left; width: 100%" data-label="">Estimated Cost Per Appointment</th>
            <td
              data-label="Per Year"
              id="estimatePricePerAppointment" style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px"
            >
              ${formatter.format(estimatePricePerAppointmentRes)}
            </td>
            <td
              data-label=""
             
            >
              &nbsp;
            </td>
          </tr> 
          <tr>
            <th style="padding: 0.625em; text-align: left; width: 100%" data-label="" >Estimated Fee</th>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Year" id="estimatedSubsriptionFeeAppointmentYearly">${formatter.format(
              appointmentPerYearRes * estimatePricePerAppointmentRes
            )}</td>
            <td style="padding: 0.625em; text-align: left; width: 100%; font-size: 16px" data-label="Per Month" id="estimatedSubsriptionFeeAppointmentMonthly">${formatter.format(
              (appointmentPerYearRes * estimatePricePerAppointmentRes) / 12
            )}</td>
          </tr> 
        </tbody>
      </table>
    </div>
  </div>

</div></div></div></div></body></html>`;
  return html;
}
function downloadPDF() {
  let annualClientValue = document.getElementById("annualClientValue").value * 1;
  let lifeTimeGrossSales = document.getElementById("lifeTimeGrossSales").value * 1;
  let appointmentToSale = document.getElementById("appointmentToSale").value * 1;
  let currentBizDevTeamSize = document.getElementById("currentBizDevTeamSize").value * 1;
  let newClientAnnualTarget = document.getElementById("newClientAnnualTarget").value * 1;
  let uname = document.getElementById("uname").value;
  let email = document.getElementById("email").value;
  let companynameForm = document.getElementById("companynameForm").value;
  let quality = document.getElementById("quality").checked;
  let speed = document.getElementById("speed").checked;
  let proprietaryProduct = document.getElementById("proprietaryProduct").checked;
  let costs = document.getElementById("costs").checked;
  let specialization = document.getElementById("specialization").checked;
  var doc = new jsPDF();
  let splitTitle = doc.splitTextToSize(
    `Hi,${uname} here is your personalized predictable growth plan based on the following inputs:`,
    180
  );
  // Inputs
  doc.text(splitTitle, 10, 20);
  doc.autoTable({
    theme: "grid",
    styles: { fontSize: 12 },
    startY: 40,
    head: [["Label", "Value"]],
    body: [
      ["Annual Client Value", `${formatter.format(annualClientValue)}`],
      ["Lifetime Gross Sales", `${formatter.format(lifeTimeGrossSales)}`],
      ["Appointment to Sale %", `${formatter.format(appointmentToSale).replace("$", "") + "%"}`],
      ["Current Biz Dev Team Size", `${formatter.format(currentBizDevTeamSize).replace("$", "")}`],
      ["New Client Annual Target", `${formatter.format(newClientAnnualTarget).replace("$", "")}`],
      ["Qulaity", `${quality ? "Selected" : "Not-Selected"}`],
      ["Speed", `${speed ? "Selected" : "Not-Selected"}`],
      ["Proprietary Product", `${proprietaryProduct ? "Selected" : "Not-Selected"}`],
      ["Costs", `${costs ? "Selected" : "Not-Selected"}`],
      ["Specialization", `${specialization ? "Selected" : "Not-Selected"}`],
      ["User Name", `${uname}`],
      ["Email", `${email}`],
      ["Company Name", `${companynameForm}`],
      // ...
    ],
  });

  // Targets
  doc.addPage();
  doc.setFontSize(15);
  doc.setFontSize(12);
  doc.text(
    `In order to acquire ${
      document.getElementById("clientTarget").innerHTML
    } clients in the next 12 months for ${
      document.getElementById("companyName").innerHTML
    }, here are your growth targets:`,
    10,
    20
  );
  doc.autoTable({ theme: "grid", styles: { fontSize: 12 }, startY: 30, html: "#table1" });

  // Conditional Content
  doc.addPage();
  if (
    document
      .getElementById("heading1")
      .innerHTML.replace('<i class="fas fa-search icon__calc"></i>', "")
      .toString()
      .trim() == "Perform Targeted Lead Generation"
  ) {
    let splitTitle = doc.splitTextToSize(
      `Prefer to trust the experts? Here's your detailed strategy to achieve predictable growth based on your 12 month targets for ${
        document.getElementById("companyName").innerHTML
      }.`,
      180
    );
    doc.text(15, 20, splitTitle);
    doc.setFontSize(18).text(15, 40, `${document.getElementById("heading0").innerHTML}`);
    splitTitle = doc.splitTextToSize(`${document.getElementById("para0").innerHTML}`, 260);
    doc.setFontSize(13).text(15, 50, splitTitle);
    doc
      .setFontSize(18)
      .text(
        15,
        40 + 25,
        `${document
          .getElementById("heading1")
          .innerHTML.replace('<i class="fas fa-search icon__calc"></i>', "")}`
      );
    splitTitle = doc.splitTextToSize(`${document.getElementById("para1").innerHTML}`, 260);
    doc.setFontSize(13).text(15, 50 + 25, splitTitle);
    doc
      .setFontSize(18)
      .text(
        15,
        70 + 25,
        `${document
          .getElementById("heading2")
          .innerHTML.replace('<i class="fas fa-bullhorn icon__calc"></i>', "")}`
      );
    splitTitle = doc.splitTextToSize(`${document.getElementById("para2").innerHTML}`, 260);
    doc.setFontSize(13).text(15, 80 + 25, splitTitle);
    doc
      .setFontSize(18)
      .text(
        15,
        110 + 25,
        `${document
          .getElementById("heading3")
          .innerHTML.replace('<i class="fas fa-check-circle icon__calc"></i>', "")}`
      );
    splitTitle = doc.splitTextToSize(`${document.getElementById("para3").innerHTML}`, 260);
    doc.setFontSize(13).text(15, 120 + 25, splitTitle);
  } else {
    let splitTitle = doc.splitTextToSize(
      `Prefer to trust the experts? Here's your detailed strategy to achieve predictable growth based on your 12 month targets for ${
        document.getElementById("companyName").innerHTML
      }.`,
      180
    );
    doc.text(15, 20, splitTitle);
    doc.setFontSize(18).text(15, 40, `${document.getElementById("heading0").innerHTML}`);
    splitTitle = doc.splitTextToSize(`${document.getElementById("para0").innerHTML}`, 260);
    doc.setFontSize(13).text(15, 50, splitTitle);
    doc
      .setFontSize(18)
      .text(
        15,
        40 + 25,
        `${document
          .getElementById("heading1")
          .innerHTML.replace('<i class="fas fa-poll icon__calc"></i> ', "")}`
      );
    splitTitle = doc.splitTextToSize(
      `${document
        .getElementById("para1")
        .innerHTML.replace(/<br><br>/g, "\n")
        .replace(/<br>/g, "\n")}`,
      260
    );
    console.log(splitTitle);
    doc.setFontSize(13).text(15, 50 + 25, splitTitle);
    doc
      .setFontSize(18)
      .text(
        15,
        110 + 25,
        `${document
          .getElementById("heading2")
          .innerHTML.replace('<i class="fas fa-bullhorn icon__calc"></i>', "")}`
      );
    splitTitle = doc.splitTextToSize(
      `${document
        .getElementById("para2")
        .innerHTML.replace(/<br><br>/g, "\n")
        .replace(/<br>/g, "\n")}`,
      260
    );
    doc.setFontSize(13).text(15, 120 + 25, splitTitle);
    doc
      .setFontSize(18)
      .text(
        15,
        180 + 25,
        `${document
          .getElementById("heading3")
          .innerHTML.replace('<i class="fas fa-check-circle icon__calc"></i>', "")}`
      );
    splitTitle = doc.splitTextToSize(
      `${document
        .getElementById("para3")
        .innerHTML.replace(/<br><br>/g, "\n")
        .replace(/<br>/g, "\n")
        .replace('<a href="https://www.youtube.com/watch?v=5L-AfNtwxSo">', "")
        .replace(
          '<a href="https://www.thinkific.com/blog/presell-productize-and-scale-coaching-business/">',
          ""
        )
        .replace("</a>", "")
        .replace("</a>", "")}`,
      260
    );
    console.log(splitTitle);
    doc.setFontSize(13).text(15, 190 + 25, splitTitle);
  }
  doc.addPage();

  splitTitle = doc.splitTextToSize(
    `Prefer to trust the experts? Here's your projected ROI from managed services with Predictable Growth.`,
    180
  );
  doc.text(10, 20, splitTitle);
  // ROI Tables
  doc.text(`Projected ROI from Managed Lead Generation`, 10, 40);
  doc.autoTable({ theme: "grid", styles: { fontSize: 12 }, startY: 50, html: "#table2" });

  doc.setFontSize(12);
  doc.text(`Projected ROI from Managed Appointment Seting`, 10, 130);
  doc.autoTable({ theme: "grid", styles: { fontSize: 12 }, startY: 140, html: "#table3" });

  doc.save("Predictable Growth Plan Report.pdf");
}
function recalculate() {
  window.location.reload();
}
