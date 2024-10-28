// pages/sdoh.tsx

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import Questions from '../api/questions.json'
import countryData from '../api/countries.json'
import { FormData, IQuestion } from '@/api/question.interface';
import { calculateSDOHscore } from '@/api/questions';

const Sections = Questions.sections.map(section => ({ name: section.title}))


const Container = styled.div`
  font-family: sans-serif;
  max-width: 800px; /* Increased width for better responsiveness */
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px; /* Adjust padding for smaller screens */
  }
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  color: #7757ff;
  margin-bottom: 15px;
`;

const Question = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
`;

const RadioLabel = styled.label`
  margin-left: 5px;
`;

const SubmitButton = styled.button`
  background-color: #7757ff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5e3fba; /* Darker shade on hover */
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow:   
 0 2px 5px rgba(0, 0, 0,   
 0.2);
  z-index: 100; 
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index:   
 99; 
`;

const CloseButton = styled.button`
  position: relative;
  top: 10px;
  left: 90%;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;


const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #7757ff;
  color: white;
  text-align: left;
  padding: 8px;
  position: sticky; // Make the header sticky
  top: 0;          // Fix it to the top of the table
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const   ModalContent = styled.div`
  max-height: 80vh; // Set maximum height for the modal content
  overflow-y: auto; // Make the content scrollable
`;

const SDOHQuestionnaire: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [sdohTotal, setTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { scores, total } = calculateSDOHscore(formData);
    setTotal(total);
    console.log("SDOH Scores:", scores);
    console.log("Total SDOH Score:", total);
    setShowModal(true); // Show the modal after calculating the score
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }
  
  // Comparison logic
  const higherCount = countryData.filter(country => parseFloat(country["Total(100%)"]) < sdohTotal).length;
  const lowerCount = countryData.filter(country => parseFloat(country["Total(100%)"]) > sdohTotal).length;

  return (
    <Container>
      <h1>SDOH Questionnaire</h1>
      <form onSubmit={handleSubmit}>
        {Sections.map((section, index) => {
          return (
            <Section key={index}>
              <SectionTitle>{section.name}</SectionTitle>
              {Questions.sections[index].questions.map((question: IQuestion) => {
                return (
                  <Question key={question.id}>
                    <Label htmlFor={question.id}>{question.text}</Label>
                    {question.options.map(option => (
                      <RadioGroup key={option}>
                        <input 
                          type="radio" 
                          id={`${question.id}${option}`} 
                          name={question.id} 
                          value={option} 
                          onChange={handleChange} 
                          checked={formData[question.id] === option}
                        />
                        <RadioLabel htmlFor={`${question.id}${option}`}>{option}</RadioLabel>
                      </RadioGroup>
                    ))}
                  </Question>
                )
              })}
            </Section>
          )
        })}

        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
      {showModal && (
        <div>
          <Overlay onClick={closeModal} />
          <Modal>
          <CloseButton onClick={closeModal}>Close</CloseButton>
          <ModalContent> {/* Wrap the content in a scrollable div */}
              <h2>Your SDOH Score: {sdohTotal}</h2>
              <p>
                Based on your responses, your SDOH score is higher than{" "}
                {higherCount} countries and lower than {lowerCount} countries
                in the list.
              </p>

              {/* Table to display countries */}
              <Table>
                <thead>
                  <TableRow>
                    <TableHeader>Country/Region</TableHeader>
                    <TableHeader>Total(100%)</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {countryData.map((country) => (
                    <TableRow key={country["#"]}>
                      <TableCell>{country["Country/Region"]}</TableCell>
                      <TableCell>{country["Total(100%)"]}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </ModalContent>
          </Modal>
        </div>
      )}
    </Container>
  );
};

export default SDOHQuestionnaire;