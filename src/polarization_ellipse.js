import { computed, ref } from 'vue'

export function polarization_ellipse() {
    // Input

    const A1 = ref(0.5)
    const A2 = ref(0.7)

    const P1 = ref(0.5)
    const P2 = ref(1.5)

    // Computed - Static

    const delta = computed(() => P2.value - P1.value)

    const s0 = computed(() => A1.value * A1.value + A2.value * A2.value)
    const s1 = computed(() => A1.value * A1.value - A2.value * A2.value)
    const s2 = computed(() => 2 * A1.value * A2.value * Math.cos(delta))
    const s3 = computed(() => 2 * A1.value * A2.value * Math.sin(delta))


    const a = computed(() => Math.sqrt((s0.value + Math.sqrt(s0.value ** 2 - s3.value ** 2)) / 2))
    const b = computed(() => Math.sqrt((s0.value + Math.sqrt(s0.value ** 2 - s3.value ** 2)) / 2))

    const theta = computed(() => Math.atan2(s2.value, s1.value) / 2)

    // Computed - Dynamic

    function time(t) {
        const x = A1.value * Math.cos(t + P1.value)
        const y = A2.value * Math.cos(t + P2.value)
        return [x, y]
    }

    return {
        A1, A2, P1, P2, delta, s0, s1, s2, s3, a, b, theta, time
    }
}

