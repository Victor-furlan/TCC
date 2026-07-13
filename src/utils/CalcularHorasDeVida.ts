export function calcularHorasDeVida(valor: number, rendaMensal: number, horasTrabalhadasMes: number): number {
  if (rendaMensal <= 0 || horasTrabalhadasMes <= 0) {
    return 0
  }

  const valorPorHora = rendaMensal / horasTrabalhadasMes

  return valor / valorPorHora
}