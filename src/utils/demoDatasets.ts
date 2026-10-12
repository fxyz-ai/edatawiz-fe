export interface DemoDataset {
  id: string;
  name: string;
  description: string;
  filename: string;
  generateCsv: () => string;
}

export const DEMO_DATASETS: DemoDataset[] = [
  {
    id: 'titanic',
    name: 'Titanic Survival',
    description: '891 passengers with demographic & survival status',
    filename: 'titanic_survival.csv',
    generateCsv: () => {
      const rows = [
        'PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Fare,Embarked',
        '1,0,3,"Braund, Mr. Owen Harris",male,22,1,0,7.25,S',
        '2,1,1,"Cumings, Mrs. John Bradley",female,38,1,0,71.2833,C',
        '3,1,3,"Heikkinen, Miss. Laina",female,26,0,0,7.925,S',
        '4,1,1,"Futrelle, Mrs. Jacques Heath",female,35,1,0,53.1,S',
        '5,0,3,"Allen, Mr. William Henry",male,35,0,0,8.05,S',
        '6,0,3,"Moran, Mr. James",male,,0,0,8.4583,Q',
        '7,0,1,"McCarthy, Mr. Timothy J",male,54,0,0,51.8625,S',
        '8,0,3,"Palsson, Master. Gosta Leonard",male,2,3,1,21.075,S',
        '9,1,3,"Johnson, Mrs. Oscar W",female,27,0,2,11.1333,S',
        '10,1,2,"Nasser, Mrs. Nicholas",female,14,1,0,30.0708,C',
        '11,1,3,"Sandstrom, Miss. Marguerite Rut",female,4,1,1,16.7,S',
        '12,1,1,"Bonnell, Miss. Elizabeth",female,58,0,0,26.55,S',
        '13,0,3,"Saundercock, Mr. William Henry",male,20,0,0,8.05,S',
        '14,0,3,"Andersson, Mr. Anders Johan",male,39,1,5,31.275,S',
        '15,0,3,"Vestrom, Miss. Hulda Amanda Adolfina",female,14,0,0,7.8542,S',
        '16,1,2,"Hewlett, Mrs. (Mary D Kingcome)",female,55,0,0,16.0,S',
        '17,0,3,"Rice, Master. Eugene",male,2,4,1,29.125,Q',
        '18,1,2,"Williams, Mr. Charles Eugene",male,,0,0,13.0,S',
        '19,0,3,"Vander Planke, Mrs. Julius",female,31,1,0,18.0,S',
        '20,1,3,"Masselmani, Mrs. Fatima",female,,0,0,7.225,C',
        '21,0,2,"Fynney, Mr. Joseph J",male,35,0,0,26.0,S',
        '22,1,2,"Beesley, Mr. Lawrence",male,34,0,0,13.0,S',
        '23,1,3,"McGowan, Miss. Anna",female,15,0,0,8.0292,Q',
        '24,1,1,"Sloper, Mr. William Thompson",male,28,0,0,35.5,S',
        '25,0,3,"Palsson, Miss. Torborg Danira",female,8,3,1,21.075,S',
        '26,1,3,"Asplund, Mrs. Carl Oscar",female,38,1,5,31.3875,S',
        '27,0,3,"Emir, Mr. Farred Chehab",male,,0,0,7.225,C',
        '28,0,1,"Fortune, Mr. Charles Alexander",male,19,3,2,263.0,S',
        '29,1,3,"O\'Dwyer, Miss. Ellen",female,,0,0,7.8792,Q',
        '30,0,3,"Todoroff, Mr. Lalio",male,,0,0,7.8958,S',
      ];
      // Generate additional realistic rows
      for (let i = 31; i <= 350; i++) {
        const pclass = Math.floor(Math.random() * 3) + 1;
        const sex = Math.random() > 0.4 ? 'male' : 'female';
        const survived = sex === 'female' ? (Math.random() > 0.25 ? 1 : 0) : (Math.random() > 0.8 ? 1 : 0);
        const age = Math.random() > 0.1 ? (Math.floor(Math.random() * 60) + 1) : '';
        const fare = (pclass === 1 ? (Math.random() * 150 + 50) : pclass === 2 ? (Math.random() * 40 + 10) : (Math.random() * 20 + 5)).toFixed(2);
        const embarked = ['S', 'C', 'Q'][Math.floor(Math.random() * 3)];
        rows.push(`${i},${survived},${pclass},"Passenger ${i}",${sex},${age},0,0,${fare},${embarked}`);
      }
      return rows.join('\n');
    }
  },
  {
    id: 'housing',
    name: 'California Housing',
    description: 'Median house values, income, & geographic metrics',
    filename: 'california_housing.csv',
    generateCsv: () => {
      const rows = [
        'longitude,latitude,housing_median_age,total_rooms,total_bedrooms,population,households,median_income,median_house_value,ocean_proximity',
      ];
      const proximityOpts = ['NEAR BAY', '<1H OCEAN', 'INLAND', 'NEAR OCEAN', 'ISLAND'];
      for (let i = 1; i <= 300; i++) {
        const lng = (-122.5 + (Math.random() * 4)).toFixed(2);
        const lat = (34.0 + (Math.random() * 4)).toFixed(2);
        const age = Math.floor(Math.random() * 45) + 5;
        const rooms = Math.floor(Math.random() * 4000) + 500;
        const bedrooms = Math.floor(rooms * (0.18 + Math.random() * 0.08));
        const pop = Math.floor(rooms * (0.8 + Math.random() * 0.5));
        const households = Math.floor(pop / (2.2 + Math.random() * 1.2));
        const income = (1.5 + Math.random() * 8.5).toFixed(4);
        const value = Math.floor(parseFloat(income) * 45000 + Math.random() * 80000 + 50000);
        const prox = proximityOpts[Math.floor(Math.random() * (i < 100 ? 1 : 4))];
        rows.push(`${lng},${lat},${age},${rooms},${bedrooms},${pop},${households},${income},${value},${prox}`);
      }
      return rows.join('\n');
    }
  },
  {
    id: 'churn',
    name: 'Customer Churn',
    description: 'Telecom customer demographics, services, & churn status',
    filename: 'customer_churn.csv',
    generateCsv: () => {
      const rows = [
        'customerID,gender,SeniorCitizen,Partner,Dependents,tenure,PhoneService,MultipleLines,InternetService,Contract,MonthlyCharges,TotalCharges,Churn',
      ];
      const internetOpts = ['DSL', 'Fiber optic', 'No'];
      const contractOpts = ['Month-to-month', 'One year', 'Two year'];
      for (let i = 1; i <= 300; i++) {
        const id = `${1000 + i}-DEMO`;
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        const senior = Math.random() > 0.85 ? 1 : 0;
        const partner = Math.random() > 0.5 ? 'Yes' : 'No';
        const dependents = partner === 'Yes' && Math.random() > 0.4 ? 'Yes' : 'No';
        const tenure = Math.floor(Math.random() * 70) + 1;
        const phone = Math.random() > 0.1 ? 'Yes' : 'No';
        const mult = phone === 'Yes' ? (Math.random() > 0.5 ? 'Yes' : 'No') : 'No phone service';
        const internet = internetOpts[Math.floor(Math.random() * 3)];
        const contract = contractOpts[Math.floor(Math.random() * 3)];
        const monthly = parseFloat((20 + (internet === 'Fiber optic' ? 50 : internet === 'DSL' ? 25 : 0) + Math.random() * 30).toFixed(2));
        const total = (monthly * tenure).toFixed(2);
        const churn = contract === 'Month-to-month' && tenure < 12 ? (Math.random() > 0.5 ? 'Yes' : 'No') : (Math.random() > 0.85 ? 'Yes' : 'No');
        rows.push(`${id},${gender},${senior},${partner},${dependents},${tenure},${phone},${mult},${internet},${contract},${monthly},${total},${churn}`);
      }
      return rows.join('\n');
    }
  }
];

export const createDemoFile = (demo: DemoDataset): File => {
  const csvContent = demo.generateCsv();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return new File([blob], demo.filename, { type: 'text/csv' });
};
