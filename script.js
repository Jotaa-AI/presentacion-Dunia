const flowInsightData = {
  all: {
    label: "Vista completa",
    text:
      "La llamada siempre encuentra una salida ordenada: humana si recepción está disponible, asistida por IA cuando hay saturación y cubierta por IA fuera de horario.",
  },
  laboral: {
    label: "Horario laboral",
    text:
      "Durante horario laboral, recepción sigue siendo la primera opción. La IA entra solo cuando la clínica está ocupada y evita que una llamada simultánea se convierta en fuga.",
  },
  transfer: {
    label: "Transferencia a humano",
    text:
      "Si la llamada atendida por la IA necesita intervención humana, el sistema la transfiere a recepción en vez de obligar al paciente a volver a llamar.",
  },
  offhours: {
    label: "Fuera de horario",
    text:
      "Fuera de horario, la IA mantiene la continuidad: resuelve dudas, activa nuevas citas por WhatsApp y deja preparadas las gestiones que requieren revisión humana.",
  },
  cancel: {
    label: "Cancelación",
    text:
      "Ante intención de cancelar, la IA no empuja ni improvisa: explora la objeción con tacto, plantea alternativas razonables y, si no procede mantener la cita, deja nota interna ordenada.",
  },
};

const scenarioData = {
  a: {
    label: "Escenario A",
    title: "Llamada en horario laboral con recepción ocupada en otra tarea",
    today:
      "La llamada llega mientras recepción está atendiendo un paciente, caja, documentación o coordinación interna. El teléfono compite contra tareas que no se pueden interrumpir con calidad.",
    future:
      "La IA atiende la llamada mientras recepción continúa con la tarea presencial. Si el usuario solicita atención humana, la llamada se transfiere a recepción; si no, la IA resuelve o encamina la gestión.",
    clinicWins: [
      "Menos interrupciones en momentos sensibles de la jornada.",
      "Más llamadas absorbidas sin tensión adicional para recepción.",
      "Un circuito uniforme cuando el equipo no puede atender el teléfono al instante.",
    ],
    patientWins: [
      "Respuesta inmediata en vez de espera o silencio.",
      "Posibilidad real de pasar con una persona si lo necesita.",
      "Percepción de clínica organizada y disponible.",
    ],
  },
  b: {
    label: "Escenario B",
    title: "Llamada en horario laboral cuando recepción ya está en otra llamada",
    today:
      "La línea entra mientras recepción está ya al teléfono. La clínica depende de que esa persona termine, detecte la llamada y pueda recuperar el contexto después.",
    future:
      "La IA absorbe la segunda llamada, clasifica la necesidad y mantiene la continuidad. Si la persona necesita atención humana, la llamada se deriva a recepción cuando corresponde.",
    clinicWins: [
      "Menos llamadas perdidas por solapamiento.",
      "Mayor capacidad de respuesta en horas de presión.",
      "Mejor control del flujo sin ampliar plantilla.",
    ],
    patientWins: [
      "No entra en una experiencia de saturación.",
      "Obtiene una orientación útil aunque la línea humana esté ocupada.",
      "Recibe una atención más consistente según el momento del día.",
    ],
  },
  c: {
    label: "Escenario C",
    title: "Llamada fuera de horario laboral",
    today:
      "Fuera de horario no hay atención operativa. Si el paciente llama por una cita o una duda básica, la llamada no encuentra continuidad y depende de que vuelva a intentarlo.",
    future:
      "La IA cubre la franja fuera de horario, resuelve dudas no clínicas, envía WhatsApp para nuevas citas, prepara cambios de hora con nota interna y trata con tacto las cancelaciones antes de registrarlas.",
    clinicWins: [
      "Continuidad de atención sin ampliar turnos.",
      "Captura de oportunidades también fuera de horario.",
      "Mejor imagen de disponibilidad y servicio.",
    ],
    patientWins: [
      "Puede avanzar su intención en el momento en que decide llamar.",
      "Evita la frustración de esperar al día siguiente para empezar de cero.",
      "Siente una atención moderna, cuidada y accesible.",
    ],
  },
};

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

function renderFlowMaps(focusKey) {
  const insightLabel = document.getElementById("flowInsightLabel");
  const insightText = document.getElementById("flowInsightText");
  const insight = flowInsightData[focusKey];
  const focusableElements = document.querySelectorAll("[data-flow-group]");

  if (!insightLabel || !insightText || !insight || !focusableElements.length) {
    return;
  }

  insightLabel.textContent = insight.label;
  insightText.textContent = insight.text;

  focusableElements.forEach((element) => {
    const groups = element.dataset.flowGroup.split(" ");
    const matches = focusKey === "all" || groups.includes(focusKey);
    element.classList.toggle("is-highlighted", matches);
    element.classList.toggle("is-muted", focusKey !== "all" && !matches);
  });

  document.querySelectorAll("[data-flow-focus]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.flowFocus === focusKey);
  });
}

function renderScenario(scenarioKey) {
  const data = scenarioData[scenarioKey];
  if (!data) return;

  const label = document.getElementById("scenarioLabel");
  const title = document.getElementById("scenarioTitle");
  const today = document.getElementById("scenarioToday");
  const future = document.getElementById("scenarioFuture");
  const clinicWins = document.getElementById("scenarioClinicWins");
  const patientWins = document.getElementById("scenarioPatientWins");

  if (!label || !title || !today || !future || !clinicWins || !patientWins) return;

  label.textContent = data.label;
  title.textContent = data.title;
  today.textContent = data.today;
  future.textContent = data.future;
  clinicWins.innerHTML = data.clinicWins.map((item) => `<li>${item}</li>`).join("");
  patientWins.innerHTML = data.patientWins.map((item) => `<li>${item}</li>`).join("");

  document.querySelectorAll(".scenario-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scenario === scenarioKey);
  });
}

function getValue(formData, key) {
  const raw = formData.get(key);
  return raw === "" ? 0 : Number(raw);
}

function formatCurrency(value) {
  return value > 0 ? currencyFormatter.format(value) : "-";
}

function formatNumber(value) {
  return value > 0 ? decimalFormatter.format(value) : "-";
}

function updateRoi() {
  const form = document.getElementById("roiForm");
  if (!form) return;

  const formData = new FormData(form);
  const missedCalls = getValue(formData, "missedCalls");
  const appointmentIntentPct = getValue(formData, "appointmentIntentPct") / 100;
  const recoveryPct = getValue(formData, "recoveryPct") / 100;
  const averageValue = getValue(formData, "averageValue");
  const monthlyCost = getValue(formData, "monthlyCost");
  const setupCost = getValue(formData, "setupCost");
  const voiceMinutes = getValue(formData, "voiceMinutes");
  const voiceCostPerMinute = getValue(formData, "voiceCostPerMinute");

  const recoveredAppointments = missedCalls * appointmentIntentPct * recoveryPct;
  const recoveredRevenue = recoveredAppointments * averageValue;
  const voiceUsageCost = voiceMinutes * voiceCostPerMinute;
  const totalMonthlyCost = monthlyCost + voiceUsageCost;
  const grossImpact = recoveredRevenue;
  const netImpact = grossImpact - totalMonthlyCost;
  const paybackMonths =
    setupCost > 0 && netImpact > 0 ? setupCost / netImpact : 0;
  const breakEvenAppointments =
    averageValue > 0
      ? Math.max(totalMonthlyCost / averageValue, 0)
      : 0;

  const recoveredAppointmentsEl = document.getElementById("recoveredAppointments");
  const recoveredRevenueEl = document.getElementById("recoveredRevenue");
  const voiceUsageCostEl = document.getElementById("voiceUsageCost");
  const totalMonthlyCostEl = document.getElementById("totalMonthlyCost");
  const netImpactEl = document.getElementById("netImpact");
  const paybackMonthsMetricEl = document.getElementById("paybackMonthsMetric");
  const roiNarrativeEl = document.getElementById("roiNarrative");
  const roiTimelineCopyEl = document.getElementById("roiTimelineCopy");
  const roiMonthsEl = document.getElementById("roiMonths");

  if (recoveredAppointmentsEl) {
    recoveredAppointmentsEl.textContent = formatNumber(recoveredAppointments);
  }
  if (recoveredRevenueEl) {
    recoveredRevenueEl.textContent = formatCurrency(recoveredRevenue);
  }
  if (voiceUsageCostEl) {
    voiceUsageCostEl.textContent = formatCurrency(voiceUsageCost);
  }
  if (totalMonthlyCostEl) {
    totalMonthlyCostEl.textContent = formatCurrency(totalMonthlyCost);
  }
  if (netImpactEl) {
    netImpactEl.textContent =
      netImpact > 0 ? currencyFormatter.format(netImpact) : netImpact < 0 ? `-${currencyFormatter.format(Math.abs(netImpact))}` : "-";
  }
  if (paybackMonthsMetricEl) {
    paybackMonthsMetricEl.textContent = paybackMonths > 0 ? `${decimalFormatter.format(paybackMonths)} meses` : "-";
  }

  if (roiNarrativeEl) {
    if (grossImpact > 0) {
      roiNarrativeEl.textContent = `Con las hipótesis seleccionadas, el sistema podría recuperar ${decimalFormatter.format(
        recoveredAppointments,
      )} oportunidades al mes, generar ${currencyFormatter.format(
        recoveredRevenue,
      )} de ingreso potencial, frente a un coste mensual total estimado de ${currencyFormatter.format(
        totalMonthlyCost,
      )}.`;
    } else {
      roiNarrativeEl.textContent =
        "Ajusta las hipótesis para visualizar el impacto potencial del sistema.";
    }
  }

  if (roiTimelineCopyEl) {
    if (netImpact > 0) {
      roiTimelineCopyEl.textContent = `Con estas hipótesis base, el retorno acumulado pasa a ser positivo aproximadamente en el mes ${Math.ceil(
        paybackMonths,
      )}. El punto de equilibrio mensual se sitúa en torno a ${decimalFormatter.format(
        breakEvenAppointments,
      )} oportunidades recuperadas al mes.`;
    } else {
      roiTimelineCopyEl.textContent =
        "Con un retorno neto mensual no positivo, el retorno acumulado no llegaría a compensar la inversión inicial.";
    }
  }

  if (roiMonthsEl) {
    const paybackMonth = netImpact > 0 ? Math.ceil(paybackMonths) : null;
    const monthsToShow = Math.min(Math.max((paybackMonth || 4) + 2, 6), 12);

    roiMonthsEl.innerHTML = Array.from({ length: monthsToShow }, (_, index) => {
      const month = index + 1;
      const cumulative = (netImpact * month) - setupCost;
      const stateClass = cumulative >= 0 ? "is-positive" : "is-negative";
      const paybackClass = paybackMonth === month ? "is-payback" : "";
      const stateLabel = cumulative >= 0 ? "Acumulado positivo" : "Pendiente de recuperar";

      return `
        <article class="roi-month-card ${stateClass} ${paybackClass}">
          <span class="roi-month-label">Mes ${month}</span>
          <strong>${currencyFormatter.format(cumulative)}</strong>
          <p>${stateLabel}</p>
        </article>
      `;
    }).join("");
  }
}

function setupNavObserver() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      threshold: [0.2, 0.45, 0.7],
      rootMargin: "-10% 0px -45% 0px",
    },
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  renderFlowMaps("all");
  renderScenario("a");
  updateRoi();
  setupNavObserver();

  document.getElementById("flowFocusToggle")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-flow-focus]");
    if (!button) return;
    renderFlowMaps(button.dataset.flowFocus);
  });

  document.getElementById("scenarioTabs")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-scenario]");
    if (!button) return;
    renderScenario(button.dataset.scenario);
  });

  document.getElementById("roiForm")?.addEventListener("input", updateRoi);
});
