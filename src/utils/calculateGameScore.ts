type MatchResult = {
  winner: "team1" | "team2" | "draw"
  victory_type: "simple" | "carroca" | "la-e-lo" | "cruzada" | "contagem" | null
}

export function calculateGameScore(matches: MatchResult[]): { team1Score: number; team2Score: number } {
  let team1Score = 0
  let team2Score = 0
  let lastWinner: "team1" | "team2" | null = null

  for (const match of matches) {
    let points = 0

    switch (match.victory_type) {
      case "simple":
        points = 1
        break
      case "carroca":
        points = 2
        break
      case "la-e-lo":
        points = 3
        break
      case "cruzada":
        points = 4
        break
      case "contagem":
        points = 1
        break
      default:
        points = 0
    }

    if (match.winner === "team1") {
      team1Score += points
      if (lastWinner === "team2") {
        team1Score += 1 // Ponto extra por vencer após um empate
      }
      lastWinner = "team1"
    } else if (match.winner === "team2") {
      team2Score += points
      if (lastWinner === "team1") {
        team2Score += 1 // Ponto extra por vencer após um empate
      }
      lastWinner = "team2"
    } else {
      lastWinner = null // Empate
    }
  }

  return { team1Score, team2Score }
}

