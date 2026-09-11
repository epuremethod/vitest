open EpureVitest

// The builder answers a promise; the runner awaits it, so the addition it
// awaits has landed by the time the first step runs.
given1("a calculator loaded from {string}", async ({step}, name: string) => {
  let calculator = ResCalculator.make(name)
  await Promise.resolve()
  calculator.add(3., 4.)

  step("the result is {number}", (n: float) => {
    expect(calculator.result).toBe(n)
  })
})
