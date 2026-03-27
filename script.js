const flowMapData = {
  current: [
    {
      title: "Entra la llamada",
      badge: "Inicio",
      tone: "neutral",
      copy: "El paciente llama con una intención real: pedir cita, cambiarla o resolver una duda simple.",
    },
    {
      title: "Recepción está ocupada",
      badge: "Fuga",
      tone: "risk",
      copy: "Está con un paciente, en otra llamada o resolviendo una tarea que no puede interrumpir bien.",
    },
    {
      title: "No hay respuesta útil",
      badge: "Fuga",
      tone: "risk",
      copy: "La llamada espera, se corta o queda para más tarde sin un circuito claro.",
    },
    {
      title: "El paciente decide si insiste",
      badge: "Riesgo",
      tone: "risk",
      copy: "Algunas personas vuelven a llamar; otras comparan o lo dejan para otro momento.",
    },
    {
      title: "La oportunidad se enfría",
      badge: "Pérdida",
      tone: "risk",
      copy: "Se pierde una posible cita y recepción gana trabajo reactivo en lugar de orden.",
    },
  ],
  future: [
    {
      title: "Entra la llamada",
      badge: "Inicio",
      tone: "neutral",
      copy: "La llamada sigue entrando por el mismo número y en los mismos momentos de presión.",
    },
    {
      title: "Respuesta inmediata",
      badge: "Resuelto",
      tone: "good",
      copy: "La llamada encuentra atención desde el primer segundo, incluso si recepción no puede coger.",
    },
    {
      title: "Se entiende el motivo",
      badge: "Resuelto",
      tone: "good",
      copy: "Se detecta si la persona quiere reservar, cambiar, cancelar o simplemente orientarse.",
    },
    {
      title: "Se guía la acción",
      badge: "Resuelto",
      tone: "good",
      copy: "Nueva cita por WhatsApp y reserva online; cambio o cancelación bien encaminados.",
    },
    {
      title: "La clínica conserva la oportunidad",
      badge: "Valor",
      tone: "good",
      copy: "La llamada deja un siguiente paso útil en vez de convertirse en una fuga o una interrupción.",
    },
  ],
};

const flowInsightData = {
  leaks: {
    label: "Puntos de fuga",
    text:
      "Hoy la fuga aparece en tres momentos: cuando recepción no puede coger, cuando ya hay otra llamada en curso y cuando alguien llama fuera de horario.",
  },
  solution: {
    label: "Proceso resuelto",
    text:
      "La solución no complica el proceso: responde, entiende el motivo y lleva la llamada hacia una acción clara en lugar de dejarla caer.",
  },
};

const scenarioData = {
  a: {
    label: "Escenario A",
    title: "Llamada en horario laboral con recepción ocupada en otra tarea",
    today:
      "La llamada llega mientras recepción está atendiendo un paciente, caja, documentación o coordinación interna. El teléfono compite contra tareas que no se pueden interrumpir con calidad.",
    future:
      "El agente responde al instante, atiende la duda frecuente o canaliza la intención. Si es una nueva cita, activa el envío por WhatsApp. Si requiere seguimiento humano, deja la solicitud preparada.",
    clinicWins: [
      "Menos interrupciones en momentos sensibles de la jornada.",
      "Más llamadas absorbidas sin tensión adicional para recepción.",
      "Un circuito uniforme cuando el equipo no puede coger el teléfono.",
    ],
    patientWins: [
      "Respuesta inmediata en vez de espera o silencio.",
      "Siguiente paso claro sin tener que volver a llamar a ciegas.",
      "Percepción de clínica organizada y disponible.",
    ],
  },
  b: {
    label: "Escenario B",
    title: "Llamada en horario laboral cuando recepción ya está en otra llamada",
    today:
      "La línea entra mientras recepción está ya al teléfono. La clínica depende de que esa persona termine, detecte la llamada y pueda recuperar el contexto después.",
    future:
      "El agente absorbe la segunda llamada, clasifica la necesidad y evita que la simultaneidad se convierta en fuga. La clínica mantiene continuidad incluso en picos de demanda.",
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
      "El agente cubre la franja fuera de horario, responde preguntas no clínicas, detecta intención de nueva cita y puede activar el circuito WhatsApp + Doctoralia para no perder la oportunidad.",
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
  const currentContainer = document.getElementById("currentFlowMap");
  const futureContainer = document.getElementById("futureFlowMap");
  const insightLabel = document.getElementById("flowInsightLabel");
  const insightText = document.getElementById("flowInsightText");
  const insight = flowInsightData[focusKey];

  if (!currentContainer || !futureContainer || !insightLabel || !insightText || !insight) {
    return;
  }

  const renderMap = (steps, mapType) =>
    steps
      .map(
        (step, index) => `
          <article class="flow-step-card flow-step-card-${step.tone} ${
            (focusKey === "leaks" && mapType === "current" && step.tone === "risk") ||
            (focusKey === "solution" && mapType === "future" && step.tone === "good")
              ? "is-highlighted"
              : ""
          }">
            <div class="flow-step-head">
              <span class="flow-step-index">0${index + 1}</span>
              <span class="flow-step-badge flow-step-badge-${step.tone}">${step.badge}</span>
            </div>
            <h4>${step.title}</h4>
            <p>${step.copy}</p>
          </article>
        `,
      )
      .join("");

  currentContainer.innerHTML = renderMap(flowMapData.current, "current");
  futureContainer.innerHTML = renderMap(flowMapData.future, "future");
  insightLabel.textContent = insight.label;
  insightText.textContent = insight.text;

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

function setBar(elementId, labelId, value, maxValue, formatter) {
  const bar = document.getElementById(elementId);
  const label = document.getElementById(labelId);
  if (!bar || !label) return;

  const width = maxValue > 0 ? Math.max((value / maxValue) * 100, 0) : 0;
  bar.style.width = `${Math.min(width, 100)}%`;
  label.textContent = value > 0 ? formatter(value) : "-";
}

function updateRoi() {
  const form = document.getElementById("roiForm");
  if (!form) return;

  const formData = new FormData(form);
  const missedCalls = getValue(formData, "missedCalls");
  const appointmentIntentPct = getValue(formData, "appointmentIntentPct") / 100;
  const recoveryPct = getValue(formData, "recoveryPct") / 100;
  const averageValue = getValue(formData, "averageValue");
  const hoursSaved = getValue(formData, "hoursSaved");
  const hourlyCost = getValue(formData, "hourlyCost");
  const monthlyCost = getValue(formData, "monthlyCost");
  const setupCost = getValue(formData, "setupCost");

  const recoveredAppointments = missedCalls * appointmentIntentPct * recoveryPct;
  const recoveredRevenue = recoveredAppointments * averageValue;
  const operationalSavings = hoursSaved * hourlyCost;
  const grossImpact = recoveredRevenue + operationalSavings;
  const netImpact = grossImpact - monthlyCost;
  const paybackMonths =
    setupCost > 0 && netImpact > 0 ? setupCost / netImpact : 0;
  const breakEvenAppointments =
    averageValue > 0
      ? Math.max((monthlyCost - operationalSavings) / averageValue, 0)
      : 0;

  const recoveredAppointmentsEl = document.getElementById("recoveredAppointments");
  const recoveredRevenueEl = document.getElementById("recoveredRevenue");
  const operationalSavingsEl = document.getElementById("operationalSavings");
  const netImpactEl = document.getElementById("netImpact");
  const roiNarrativeEl = document.getElementById("roiNarrative");
  const paybackCopyEl = document.getElementById("paybackCopy");
  const breakEvenCopyEl = document.getElementById("breakEvenCopy");

  if (recoveredAppointmentsEl) {
    recoveredAppointmentsEl.textContent = formatNumber(recoveredAppointments);
  }
  if (recoveredRevenueEl) {
    recoveredRevenueEl.textContent = formatCurrency(recoveredRevenue);
  }
  if (operationalSavingsEl) {
    operationalSavingsEl.textContent = formatCurrency(operationalSavings);
  }
  if (netImpactEl) {
    netImpactEl.textContent =
      netImpact > 0 ? currencyFormatter.format(netImpact) : netImpact < 0 ? `-${currencyFormatter.format(Math.abs(netImpact))}` : "-";
  }

  if (roiNarrativeEl) {
    if (grossImpact > 0) {
      roiNarrativeEl.textContent = `Con estas hipótesis, el sistema podría recuperar ${decimalFormatter.format(
        recoveredAppointments,
      )} oportunidades al mes, generar ${currencyFormatter.format(
        recoveredRevenue,
      )} de ingreso potencial y aportar ${currencyFormatter.format(
        operationalSavings,
      )} en eficiencia operativa.`;
    } else {
      roiNarrativeEl.textContent =
        "Introduce tus hipótesis para visualizar el impacto potencial del sistema.";
    }
  }

  if (paybackCopyEl) {
    if (setupCost > 0 && netImpact > 0) {
      paybackCopyEl.textContent = `Con estas cifras, la inversión inicial se recuperaría en aproximadamente ${decimalFormatter.format(
        paybackMonths,
      )} meses.`;
    } else if (setupCost > 0) {
      paybackCopyEl.textContent =
        "Para calcular recuperación de implantación, el retorno neto mensual debe ser positivo.";
    } else {
      paybackCopyEl.textContent =
        "Cuando añadas inversión inicial y retorno neto mensual, aquí verás el plazo estimado de recuperación.";
    }
  }

  if (breakEvenCopyEl) {
    if (averageValue > 0 && monthlyCost > 0) {
      breakEvenCopyEl.textContent = `Con estas hipótesis, bastaría recuperar aproximadamente ${decimalFormatter.format(
        breakEvenAppointments,
      )} oportunidades al mes para cubrir la cuota mensual.`;
    } else {
      breakEvenCopyEl.textContent =
        "El simulador mostrará cuántas oportunidades recuperadas al mes bastan para cubrir la cuota mensual.";
    }
  }

  const maxBarValue = Math.max(recoveredRevenue, operationalSavings, monthlyCost, 1);
  setBar("barRecoveredRevenue", "barRecoveredRevenueLabel", recoveredRevenue, maxBarValue, currencyFormatter.format);
  setBar("barOperationalSavings", "barOperationalSavingsLabel", operationalSavings, maxBarValue, currencyFormatter.format);
  setBar("barMonthlyCost", "barMonthlyCostLabel", monthlyCost, maxBarValue, currencyFormatter.format);
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
  renderFlowMaps("leaks");
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
