import { FiveHundredCompany } from './types';
import fetch from 'node-fetch';
import * as fs from 'fs';
import { exit } from 'process';

const API_URL = 'https://500.co/api/startups';
const COMPANIES_DIR = './companies';
const INDUSTRIES_DIR = './industries';

interface RawCompany {
  id: number;
  oneLiner: string | null;
  organization: {
    id: number;
    name: string;
    alternativeName: string | null;
    businessName: string | null;
    companyUrl: string | null;
    companyLinkedIn: string | null;
    imageUrl: string | null;
    countryOfOperation: {
      name: string;
    } | null;
  };
  stage: {
    name: string;
  } | null;
  industries: {
    name: string;
  }[];
}

const main = async () => {
  try {
    // Create directories if they don't exist
    if (!fs.existsSync(COMPANIES_DIR)) {
      fs.mkdirSync(COMPANIES_DIR);
    }
    if (!fs.existsSync(INDUSTRIES_DIR)) {
      fs.mkdirSync(INDUSTRIES_DIR);
    }


    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json() as { res: RawCompany[] };

    const companies: FiveHundredCompany[] = data.res.map((company) => {
      const slug = (company.organization.businessName || company.organization.name).toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
      return {
        id: company.id,
        name: company.organization.name,
        slug,
        website: company.organization.companyUrl || '',
        description: company.oneLiner || '',
        one_liner: company.oneLiner || '',
        location: company.organization.countryOfOperation?.name || '',
        industry: company.industries.map((i) => i.name).join(', '),
        subindustry: '', // Not available in API
        status: 'Active', // Assuming active, will need to refine
        founded_year: undefined, // Not available in API
        logo_url: company.organization.imageUrl || '',
        is_billion_plus: false, // Not available in API
        is_in_program: true, // Assuming all are in the program
        is_bcorp: false, // Not available in API
        tags: company.industries.map((i) => i.name),
        url: `https://500.co/portfolio/${slug}`,
        api: `/companies/${slug}.json`,
      };
    });

    // Write all.json
    fs.writeFileSync(`${COMPANIES_DIR}/all.json`, JSON.stringify(companies, null, 2));
    console.log(`Successfully wrote ${companies.length} companies to ${COMPANIES_DIR}/all.json`);

    // Write individual company files
    companies.forEach((company) => {
        fs.writeFileSync(`${COMPANIES_DIR}/${company.slug}.json`, JSON.stringify(company, null, 2));
    });
    console.log(`Successfully wrote ${companies.length} individual company files.`);

    // Write active.json
    const activeCompanies = companies.filter((c) => c.status === 'Active');
    fs.writeFileSync(`${COMPANIES_DIR}/active.json`, JSON.stringify(activeCompanies, null, 2));
    console.log(`Successfully wrote ${activeCompanies.length} companies to ${COMPANIES_DIR}/active.json`);

    // Generate industry files
    const industries: { [key: string]: FiveHundredCompany[] } = {};
    companies.forEach((company) => {
        company.tags.forEach((industry) => {
            if (!industries[industry]) {
                industries[industry] = [];
            }
            industries[industry].push(company);
        });
    });

    Object.keys(industries).forEach((industry) => {
        const industrySlug = industry.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        fs.writeFileSync(`${INDUSTRIES_DIR}/${industrySlug}.json`, JSON.stringify(industries[industry], null, 2));
    });
    console.log(`Successfully wrote ${Object.keys(industries).length} industry files.`);


  } catch (error) {
    console.error('Error fetching and processing data:', error);
  }
};

main();
