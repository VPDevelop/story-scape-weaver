
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="py-8 px-2 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-sm md:prose-base max-w-none">
        <p className="text-muted-foreground mb-4">Last updated: May 18, 2025</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to LunaTales ("we," "our," or "us"). By accessing or using our application, 
            you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, 
            you may not access the application.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Use of Service</h2>
          <p>
            LunaTales provides a platform for creating personalized children's stories. You may use our services 
            for personal, non-commercial purposes only. You must be at least 18 years old or have parental consent 
            to use this application.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information. You are responsible 
            for safeguarding the password and for all activities that occur under your account. You agree to notify us 
            immediately of any unauthorized use of your account.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Content</h2>
          <p>
            Our application uses AI to generate personalized stories. While we strive to ensure appropriateness for children, 
            we cannot guarantee that all generated content will be suitable for all ages. You are responsible for reviewing 
            the content before sharing it with children.
          </p>
          <p>
            We retain ownership of all intellectual property rights for the content generated through our service. You are 
            granted a non-exclusive, non-transferable license to use the generated stories for personal use.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Prohibited Activities</h2>
          <p>
            You may not:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Use our service for any illegal purpose or in violation of any local, state, national, or international law</li>
            <li>Attempt to probe, scan, or test the vulnerability of our system or breach security measures</li>
            <li>Interfere with or disrupt our services or servers</li>
            <li>Create stories containing explicit, harmful, or inappropriate content</li>
            <li>Distribute, publish, or commercialize stories generated through our service without permission</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p>
            In no event shall LunaTales be liable for any special, indirect, or consequential damages or any damages 
            whatsoever resulting from loss of use, data, or profits, arising out of or in connection with the use 
            or performance of our service.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of significant changes by 
            posting the new Terms on the application and updating the "Last updated" date.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@lunatales.com.
          </p>
        </section>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default TermsOfService;
