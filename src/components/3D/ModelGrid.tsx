"use client";
import BarricadeSetModel from './models/BarricadeSetModel';
import BowlingPinModel from './models/BowlingPinModel';
import BowlingBallModel from './models/BowlingBallModel';
import BrickModel from './models/BrickModel';
import DrivableCar from './models/DrivableCar';
import HumanModel from './models/HumanModel';
import ChessModel from './models/ChessModel';
import TrainModel from './models/TrainModel';
import SignsModel from './models/SignsModel';
import CurvedRoadsModel from './models/CurvedRoadsModel';
import TreesModel from './models/TreesModel';
import Trees2Model from './models/Trees2Model';
import GuitarModel from './models/GuitarModel';

export default function ModelGrid() {
  return (
    <>
      {/* Row 1 */}
      <BarricadeSetModel position={[-30, 0, -30]} />
      <BowlingPinModel position={[-10, 0, -30]} />
      <BowlingBallModel position={[10, 0, -30]} />
      <BrickModel position={[30, 0, -30]} />
      
      {/* Row 2 */}
  <DrivableCar position={[0, 0, -50]} />
      <HumanModel position={[-10, 0, -10]} />
      <ChessModel position={[10, 0, -10]} />
      <TrainModel position={[30, 0, -10]} />
      
      {/* Row 3 */}
      <SignsModel position={[-30, 0, 10]} />
      <CurvedRoadsModel position={[-10, 0, 10]} />
      <TreesModel position={[30, 0, 10]} />
      
      {/* Row 4 */}
      <Trees2Model position={[-30, 0, 30]} />
      <GuitarModel position={[-10, 0, 30]} />
      {/* Empty spots at [10, 0, 30] and [30, 0, 30] for future expansion */}
    </>
  );
}
