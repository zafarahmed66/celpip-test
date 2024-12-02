
interface ScenarioSection {
    content: string;
    scenarioInfo: string;
  }
  
  export const ScenarioSection: React.FC<ScenarioSection> = ({ content, scenarioInfo }) => {
    return (
      <div className="p-4 overflow-y-scroll bg-customLighGray">
         <h2 className="mb-4 font-medium text-customLightBlue">
          <span className="inline-block w-6 h-6 mr-2 text-center text-white rounded-full bg-customLightBlue">i</span>
          {scenarioInfo}
        </h2>
        <div className="text-sm text-gray-600 whitespace-pre-wrap">{content}</div>
      </div>
    );
  };