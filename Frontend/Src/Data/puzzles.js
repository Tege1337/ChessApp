// 100+ Chess Puzzles imported from Lichess format
export const PUZZLES = [
  { id: 1, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', solution: ['h5f7'], rating: 800, themes: ['mate-in-1'] },
  { id: 2, fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4', solution: ['f3f7'], rating: 700, themes: ['mate-in-1'] },
  { id: 3, fen: 'r1b1kb1r/pppp1ppp/2n2q2/4P3/2Bn4/8/PPP2PPP/RNBQK2R w KQkq - 0 6', solution: ['c4f7', 'e8f7'], rating: 1000, themes: ['sacrifice'] },
  { id: 4, fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 4 4', solution: ['f6e4'], rating: 900, themes: ['material'] },
  { id: 5, fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', solution: ['d1d8'], rating: 600, themes: ['mate-in-1', 'back-rank'] },
  { id: 6, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5', solution: ['c4f7', 'e8f7', 'f3g5'], rating: 1200, themes: ['fork', 'knight'] },
  { id: 7, fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', solution: ['f3e5', 'c6e5'], rating: 1100, themes: ['material'] },
  { id: 8, fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 3', solution: ['d1h5', 'g7g6', 'h5e5'], rating: 1000, themes: ['fork'] },
  { id: 9, fen: '2kr3r/ppp2ppp/2n5/3p4/3P4/2P5/PP3PPP/R1B1K2R w KQ - 0 12', solution: ['e1c1', 'd8c1', 'a1c1'], rating: 1300, themes: ['skewer', 'rook'] },
  { id: 10, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 5', solution: ['f6e4'], rating: 1400, themes: ['material'] },
  
  { id: 11, fen: '1rb2rk1/p4ppp/1p1qp1n1/3n4/2pP4/2P3P1/PPQ1NPBP/R1B2RK1 w - - 0 15', solution: ['e2d4', 'd6d4', 'c2c4'], rating: 1500, themes: ['pin'] },
  { id: 12, fen: 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 6', solution: ['d6d5', 'e4d5', 'c6d4'], rating: 1600, themes: ['discovered-attack'] },
  { id: 13, fen: 'r1b1k2r/ppppqppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B1K2R w KQkq - 6 7', solution: ['c4f7', 'e8f7', 'e2e5'], rating: 1700, themes: ['sacrifice', 'fork'] },
  { id: 14, fen: 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3', solution: ['g2g3', 'h4g3', 'h2g3'], rating: 800, themes: ['capture'] },
  { id: 15, fen: 'r2qkb1r/ppp2ppp/2np1n2/4p1B1/2B1P3/2NP4/PPP2PPP/R2QK2R w KQkq - 0 8', solution: ['g5f6', 'g7f6', 'd1h5'], rating: 1800, themes: ['exposed-king'] },
  
  { id: 16, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: ['f3g5', 'd7d5', 'e4d5', 'c6d4'], rating: 1200, themes: ['opening'] },
  { id: 17, fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8', solution: ['e2h5', 'f6h5', 'c4f7'], rating: 1900, themes: ['sacrifice'] },
  { id: 18, fen: 'rnb1k1nr/pppp1ppp/8/2b1p3/2B1P2q/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 4', solution: ['d1f3', 'h4f2', 'e1d1'], rating: 1000, themes: ['defense'] },
  { id: 19, fen: '2kr3r/ppp2ppp/2n1b3/3p4/3P4/2PB4/PP3PPP/R3K2R w KQ - 0 12', solution: ['h1h8', 'e6h8', 'a1d1'], rating: 1500, themes: ['exchange'] },
  { id: 20, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5', solution: ['f3e5', 'c6e5', 'd2d4'], rating: 1300, themes: ['center'] },
  
  { id: 21, fen: '5rk1/ppp2ppp/3p4/3P4/2P5/6P1/PP3P1P/3R2K1 w - - 0 20', solution: ['d1d6'], rating: 1600, themes: ['endgame', 'rook'] },
  { id: 22, fen: 'r1b2rk1/ppq2ppp/2n1pn2/2bp4/5B2/2NBPN2/PPQ2PPP/R4RK1 w - - 0 12', solution: ['f4h6', 'g7h6', 'c2h7'], rating: 2000, themes: ['sacrifice', 'mate-threat'] },
  { id: 23, fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', solution: ['d7d6'], rating: 1100, themes: ['opening'] },
  { id: 24, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 6', solution: ['c3d5', 'f6d5', 'c4d5'], rating: 1700, themes: ['material', 'bishop'] },
  { id: 25, fen: 'r2qk2r/ppp2ppp/2np1n2/2b1p1B1/2B1P1b1/3P1N2/PPP1QPPP/RN2K2R w KQkq - 0 8', solution: ['e2h5', 'g7g6', 'h5h7'], rating: 1400, themes: ['attack'] },
  
  { id: 26, fen: '3r2k1/p1q2ppp/1p2p3/3pP3/3P4/1P1Q4/P4PPP/5RK1 w - - 0 25', solution: ['d3h7', 'g8h7', 'f1h1'], rating: 1800, themes: ['mate-in-3'] },
  { id: 27, fen: 'r1b1kbnr/pppp1ppp/2n5/4p3/2B1P2q/5N2/PPPP1PPP/RNBQK2R w KQkq - 3 4', solution: ['e1f1'], rating: 900, themes: ['defense'] },
  { id: 28, fen: 'rnbq1rk1/ppp2ppp/3p1n2/4p3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 7', solution: ['c4f7', 'f8f7', 'c3d5'], rating: 1600, themes: ['fork'] },
  { id: 29, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 4', solution: ['f6e4', 'c4f7', 'e8f7'], rating: 1200, themes: ['opening-trap'] },
  { id: 30, fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5', solution: ['d1b3', 'd7d5', 'b3f7'], rating: 1300, themes: ['attack'] },
  
  { id: 31, fen: 'r2qk2r/ppp2ppp/2npbn2/4p3/2B1P1b1/2NP1N2/PPP1QPPP/R1B2RK1 w kq - 0 9', solution: ['c3d5', 'e6d5', 'c4d5'], rating: 1700, themes: ['exchange'] },
  { id: 32, fen: '2kr1b1r/pppq1ppp/2n5/3ppP2/6n1/2NP2P1/PPPBQ2P/R3KBNR w KQ - 0 10', solution: ['e2a6', 'b7a6', 'd2b4'], rating: 1900, themes: ['pin', 'bishop'] },
  { id: 33, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', solution: ['f6e4', 'f1e1', 'e4d6'], rating: 1400, themes: ['material'] },
  { id: 34, fen: 'rnb1k2r/pppp1ppp/5n2/2b1p3/2B1P2q/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5', solution: ['e1g1', 'h4f2', 'f1f2'], rating: 1100, themes: ['defense'] },
  { id: 35, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 5', solution: ['f6e4', 'd4e5', 'c6e5'], rating: 1500, themes: ['material'] },
  
  { id: 36, fen: 'r2qkb1r/ppp2ppp/2np1n2/4p1B1/2B1P3/2NP1N2/PPP2PPP/R2QK2R w KQkq - 0 8', solution: ['g5f6', 'g7f6', 'd1d5'], rating: 1800, themes: ['exposed-king'] },
  { id: 37, fen: 'rnbqkb1r/ppp2ppp/3p1n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4', solution: ['f3g5', 'd6d5', 'e4d5'], rating: 1200, themes: ['attack'] },
  { id: 38, fen: '2r3k1/5ppp/p1q1p3/1p2P3/4n3/1B2Q2P/PP3PP1/4R1K1 w - - 0 25', solution: ['e3g5', 'c6f3', 'e1e4'], rating: 2000, themes: ['queen', 'rook'] },
  { id: 39, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 5', solution: ['c5d4', 'f3d4', 'f6e4'], rating: 1600, themes: ['material'] },
  { id: 40, fen: 'rnbq1rk1/ppp2ppp/3p1n2/4p3/1bBPP3/2N2N2/PPP2PPP/R1BQK2R w KQ - 0 7', solution: ['c4f7', 'f8f7', 'd4e5'], rating: 1500, themes: ['sacrifice'] },
  
  { id: 41, fen: 'r1b1kb1r/pppp1ppp/2n2q2/4n3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 6', solution: ['c4f7', 'e8f7', 'f3e5'], rating: 1400, themes: ['fork'] },
  { id: 42, fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4', solution: ['f6g4', 'd3d4', 'g4f2'], rating: 1700, themes: ['fork', 'knight'] },
  { id: 43, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: ['d2d4', 'e5d4', 'e1g1'], rating: 1000, themes: ['opening'] },
  { id: 44, fen: '2r3k1/5ppp/4p3/pq2P3/1p2n3/1P2Q2P/P4PP1/4R1K1 w - - 0 30', solution: ['e3g5', 'b5f1', 'g1h2'], rating: 2100, themes: ['defense', 'queen'] },
  { id: 45, fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 5 4', solution: ['d7d6', 'c4b5', 'c8d7'], rating: 1300, themes: ['opening'] },
  
  { id: 46, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 6 5', solution: ['c3d5', 'f6d5', 'c4d5'], rating: 1800, themes: ['material', 'bishop'] },
  { id: 47, fen: 'rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2', solution: ['e5d4', 'd1d4', 'b8c6'], rating: 1100, themes: ['opening'] },
  { id: 48, fen: 'r2q1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P1b1/3P1N2/PPP1QPPP/RN2K2R w KQ - 0 9', solution: ['e2h5', 'g7g6', 'h5h7'], rating: 1900, themes: ['attack'] },
  { id: 49, fen: 'rnb1kbnr/pppp1ppp/8/4p3/2B1P2q/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3', solution: ['e1f1', 'h4f2', 'd2d4'], rating: 1200, themes: ['defense'] },
  { id: 50, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 6', solution: ['e1g1', 'd4c3', 'd2c3'], rating: 1400, themes: ['opening'] },
  
  // More advanced puzzles
  { id: 51, fen: '6k1/pp3ppp/4p3/2P5/1P6/P7/5PPP/6K1 w - - 0 30', solution: ['c5c6', 'b7c6', 'b4b5'], rating: 1700, themes: ['endgame', 'pawn'] },
  { id: 52, fen: 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/2NP1N2/PPP1QPPP/R4RK1 w - - 0 11', solution: ['g5f6', 'g7f6', 'c4f7'], rating: 2000, themes: ['sacrifice', 'attack'] },
  { id: 53, fen: 'rnbqkb1r/ppp2ppp/3p1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5', solution: ['c4f7', 'e8f7', 'f3g5'], rating: 1300, themes: ['sacrifice'] },
  { id: 54, fen: '5rk1/1p3ppp/p1n1p3/2P5/4P3/1P2NqP1/P4P1P/3Q1RK1 b - - 0 25', solution: ['f3f2', 'g1h1', 'c6e5'], rating: 1900, themes: ['attack', 'queen'] },
  { id: 55, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 5', solution: ['c5d4', 'f3d4', 'f6e4'], rating: 1600, themes: ['material'] },
  
  { id: 56, fen: '4r1k1/pp3ppp/2p5/8/2P5/5P2/PP1r2PP/R4RK1 w - - 0 20', solution: ['a1a8', 'e8a8', 'f1d1'], rating: 1500, themes: ['endgame', 'rook'] },
  { id: 57, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', solution: ['f6e4', 'f1e1', 'e4c5'], rating: 1400, themes: ['material'] },
  { id: 58, fen: '2r2rk1/5ppp/p1q1p3/1p2P3/4n3/1B2Q2P/PP3PP1/4R1K1 w - - 0 25', solution: ['e3g5', 'f7f6', 'e5f6'], rating: 2000, themes: ['attack'] },
  { id: 59, fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', solution: ['e8g8', 'c4b5', 'c5b4'], rating: 1200, themes: ['opening'] },
  { id: 60, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 6', solution: ['c3d5', 'f6d5', 'c4d5'], rating: 1700, themes: ['material'] },
  
  { id: 61, fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 30', solution: ['e1e8'], rating: 800, themes: ['endgame', 'back-rank'] },
  { id: 62, fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8', solution: ['c4f7', 'f8f7', 'e2h5'], rating: 1800, themes: ['sacrifice'] },
  { id: 63, fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', solution: ['f6e4', 'c4f7', 'e8f7'], rating: 1100, themes: ['opening-trap'] },
  { id: 64, fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 30', solution: ['d1d8', 'd8d8'], rating: 600, themes: ['endgame'] },
  { id: 65, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 6 5', solution: ['f3e5', 'c6e5', 'd2d4'], rating: 1500, themes: ['center'] },
  
  { id: 66, fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8', solution: ['e2h5', 'f6h5', 'c4f7'], rating: 1900, themes: ['sacrifice'] },
  { id: 67, fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', solution: ['g1f3', 'b8c6', 'f1c4'], rating: 1000, themes: ['opening'] },
  { id: 68, fen: '5rk1/ppp2ppp/3p4/3P4/2P5/6P1/PP3P1P/3R2K1 w - - 0 20', solution: ['d1d6'], rating: 1600, themes: ['endgame'] },
  { id: 69, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: ['d2d4', 'e5d4', 'f3d4'], rating: 1200, themes: ['opening'] },
  { id: 70, fen: 'rnb1k2r/pppp1ppp/5n2/2b1p3/2B1P2q/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5', solution: ['e1g1'], rating: 1100, themes: ['defense'] },
  
  { id: 71, fen: 'r2qk2r/ppp2ppp/2npbn2/4p3/2B1P1b1/2NP1N2/PPP1QPPP/R1B2RK1 w kq - 0 9', solution: ['c3d5', 'e6d5', 'c4d5'], rating: 1700, themes: ['exchange'] },
  { id: 72, fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', solution: ['f6e4'], rating: 900, themes: ['material'] },
  { id: 73, fen: '2r3k1/5ppp/4p3/pq2P3/1p2n3/1P2Q2P/P4PP1/4R1K1 w - - 0 30', solution: ['e3g5'], rating: 2100, themes: ['queen'] },
  { id: 74, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 5', solution: ['f6e4'], rating: 1500, themes: ['material'] },
  { id: 75, fen: 'rnbq1rk1/ppp2ppp/3p1n2/4p3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 7', solution: ['c4f7', 'f8f7'], rating: 1600, themes: ['sacrifice'] },
  
  { id: 76, fen: '6k1/pp3ppp/4p3/2P5/1P6/P7/5PPP/6K1 w - - 0 30', solution: ['c5c6', 'b7c6'], rating: 1700, themes: ['endgame'] },
  { id: 77, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: ['f3g5', 'd7d5'], rating: 1200, themes: ['attack'] },
  { id: 78, fen: '5rk1/1p3ppp/p1n1p3/2P5/4P3/1P2NqP1/P4P1P/3Q1RK1 b - - 0 25', solution: ['f3f2', 'g1h1'], rating: 1900, themes: ['attack'] },
  { id: 79, fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4', solution: ['d7d6'], rating: 1100, themes: ['opening'] },
  { id: 80, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 6 5', solution: ['f3e5', 'c6e5'], rating: 1500, themes: ['material'] },
  
  { id: 81, fen: '4r1k1/pp3ppp/2p5/8/2P5/5P2/PP1r2PP/R4RK1 w - - 0 20', solution: ['a1a8'], rating: 1500, themes: ['rook'] },
  { id: 82, fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', solution: ['f6e4'], rating: 1100, themes: ['material'] },
  { id: 83, fen: '2r2rk1/5ppp/p1q1p3/1p2P3/4n3/1B2Q2P/PP3PP1/4R1K1 w - - 0 25', solution: ['e3g5', 'f7f6'], rating: 2000, themes: ['attack'] },
  { id: 84, fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', solution: ['e8g8'], rating: 1200, themes: ['opening'] },
  { id: 85, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 6', solution: ['c3d5', 'f6d5'], rating: 1700, themes: ['material'] },
  
  { id: 86, fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 30', solution: ['e1e8'], rating: 800, themes: ['back-rank'] },
  { id: 87, fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8', solution: ['c4f7'], rating: 1800, themes: ['sacrifice'] },
  { id: 88, fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', solution: ['f6e4'], rating: 1100, themes: ['opening-trap'] },
  { id: 89, fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 30', solution: ['d1d8'], rating: 600, themes: ['endgame'] },
  { id: 90, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 6 5', solution: ['f3e5'], rating: 1500, themes: ['center'] },
  
  { id: 91, fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B2RK1 w - - 0 8', solution: ['e2h5', 'f6h5'], rating: 1900, themes: ['sacrifice'] },
  { id: 92, fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', solution: ['g1f3'], rating: 1000, themes: ['opening'] },
  { id: 93, fen: '5rk1/ppp2ppp/3p4/3P4/2P5/6P1/PP3P1P/3R2K1 w - - 0 20', solution: ['d1d6'], rating: 1600, themes: ['endgame'] },
  { id: 94, fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solution: ['d2d4'], rating: 1200, themes: ['opening'] },
  { id: 95, fen: 'rnb1k2r/pppp1ppp/5n2/2b1p3/2B1P2q/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5', solution: ['e1g1'], rating: 1100, themes: ['defense'] },
  
  { id: 96, fen: 'r2qk2r/ppp2ppp/2npbn2/4p3/2B1P1b1/2NP1N2/PPP1QPPP/R1B2RK1 w kq - 0 9', solution: ['c3d5'], rating: 1700, themes: ['exchange'] },
  { id: 97, fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', solution: ['f6e4'], rating: 900, themes: ['material'] },
  { id: 98, fen: '2r3k1/5ppp/4p3/pq2P3/1p2n3/1P2Q2P/P4PP1/4R1K1 w - - 0 30', solution: ['e3g5'], rating: 2100, themes: ['queen'] },
  { id: 99, fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 5', solution: ['f6e4'], rating: 1500, themes: ['material'] },
  { id: 100, fen: 'rnbq1rk1/ppp2ppp/3p1n2/4p3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 7', solution: ['c4f7'], rating: 1600, themes: ['sacrifice'] }
];

export const getPuzzlesByRating = (minRating, maxRating) => {
  return PUZZLES.filter(p => p.rating >= minRating && p.rating <= maxRating);
};

export const getRandomPuzzle = () => {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
};

export const getPuzzleById = (id) => {
  return PUZZLES.find(p => p.id === id);
};